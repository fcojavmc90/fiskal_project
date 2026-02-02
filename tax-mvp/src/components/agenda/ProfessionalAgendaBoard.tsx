"use client";

import { useEffect, useMemo, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { getCurrentUser } from "aws-amplify/auth";

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import {
  professionalAgendasByProfessionalId as gqlListAgendaByProfessional,
} from "@/src/graphql/queries";
import {
  createProfessionalAgenda as gqlCreateAgenda,
  updateProfessionalAgenda as gqlUpdateAgenda,
  deleteProfessionalAgenda as gqlDeleteAgenda,
} from "@/src/graphql/mutations";

type AgendaStatus = "AVAILABLE" | "PENDING" | "ACCEPTED" | "MOVED" | "REJECTED";

type AgendaItem = {
  id: string;
  professionalId: string;
  clientId?: string | null;
  date: string;
  time: string;
  status: AgendaStatus;
  meetingLink?: string | null;
};

const client = generateClient();

function statusBadgeVariant(status: AgendaStatus): "default" | "success" | "warning" | "danger" {
  switch (status) {
    case "AVAILABLE":
      return "success";
    case "PENDING":
    case "MOVED":
      return "warning";
    case "ACCEPTED":
      return "default";
    case "REJECTED":
      return "danger";
    default:
      return "default";
  }
}

export default function ProfessionalAgendaBoard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<AgendaItem[]>([]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  }, [items]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const u = await getCurrentUser();
      const professionalId = u.userId;

      const res = (await client.graphql({
        query: gqlListAgendaByProfessional,
        variables: {
          professionalId,
          sortDirection: "ASC",
          // Amplify v2 key query requiere las 3 fields; mandamos mínimos para rango
          date: "0000-00-00",
          time: "00:00",
        },
      })) as any;

      const list = res?.data?.professionalAgendasByProfessionalId?.items ?? [];
      setItems(
        list
          .filter(Boolean)
          .map((x: any) => ({
            id: x.id,
            professionalId: x.professionalId,
            clientId: x.clientId ?? null,
            date: x.date,
            time: x.time,
            status: x.status,
            meetingLink: x.meetingLink ?? null,
          }))
      );
    } catch (e: any) {
      setError(e?.message ?? "Error cargando agenda");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addSlot() {
    setError(null);
    try {
      const u = await getCurrentUser();
      const professionalId = u.userId;

      if (!date || !time) {
        setError("Debes seleccionar fecha y hora.");
        return;
      }

      await client.graphql({
        query: gqlCreateAgenda,
        variables: {
          input: {
            professionalId,
            date,
            time,
            status: "AVAILABLE",
          },
        },
      });

      setDate("");
      setTime("");
      await load();
    } catch (e: any) {
      setError(e?.message ?? "No se pudo crear el bloque");
    }
  }

  async function removeSlot(id: string) {
    setError(null);
    try {
      await client.graphql({
        query: gqlDeleteAgenda,
        variables: { input: { id } },
      });
      await load();
    } catch (e: any) {
      setError(e?.message ?? "No se pudo eliminar");
    }
  }

  async function markStatus(id: string, status: AgendaStatus) {
    setError(null);
    try {
      await client.graphql({
        query: gqlUpdateAgenda,
        variables: { input: { id, status } },
      });
      await load();
    } catch (e: any) {
      setError(e?.message ?? "No se pudo actualizar");
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Agenda Profesional</CardTitle>
          <CardDescription>Crea bloques disponibles y gestiona estados.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="danger" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha</label>
              <input
                className="w-full rounded-lg border border-[var(--fk-border,#e5e7eb)] bg-white px-3 py-2"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hora</label>
              <input
                className="w-full rounded-lg border border-[var(--fk-border,#e5e7eb)] bg-white px-3 py-2"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={addSlot} disabled={loading}>
                Agregar bloque
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bloques</CardTitle>
          <CardDescription>{loading ? "Cargando..." : `${sorted.length} bloque(s)`}</CardDescription>
        </CardHeader>
        <CardContent>
          {sorted.length === 0 && !loading ? (
            <div className="text-sm text-[color:var(--fk-muted,#6b7280)]">No hay bloques todavía.</div>
          ) : (
            <div className="space-y-2">
              {sorted.map((it) => (
                <div
                  key={it.id}
                  className="flex flex-col gap-2 rounded-xl border border-[var(--fk-border,#e5e7eb)] bg-white p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{it.date} · {it.time}</div>
                    <Badge variant={statusBadgeVariant(it.status)}>{it.status}</Badge>
                    {it.clientId ? (
                      <span className="text-xs text-[color:var(--fk-muted,#6b7280)]">cliente: {String(it.clientId).slice(0, 8)}…</span>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => markStatus(it.id, "AVAILABLE")}>Disponible</Button>
                    <Button variant="outline" onClick={() => markStatus(it.id, "PENDING")}>Pendiente</Button>
                    <Button variant="outline" onClick={() => markStatus(it.id, "ACCEPTED")}>Aceptar</Button>
                    <Button variant="outline" onClick={() => markStatus(it.id, "MOVED")}>Mover</Button>
                    <Button variant="outline" onClick={() => markStatus(it.id, "REJECTED")}>Rechazar</Button>
                    <Button variant="destructive" onClick={() => removeSlot(it.id)}>Eliminar</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
