"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration,
} from "amazon-chime-sdk-js";
import { getAppointmentById } from "../../lib/graphqlClient";
import { ensureAmplifyConfigured } from "../../lib/amplifyClient";

export default function CallPageClient() {
  ensureAmplifyConfigured();
  const params = useSearchParams();
  const appt = params.get("appt") || "";
  const tokenParam = params.get("token") || "";
  const role = params.get("role") || "client";
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Conectando...");
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const meetingSessionRef = useRef<DefaultMeetingSession | null>(null);
  const localTileIdRef = useRef<number | null>(null);
  const remoteTileIdRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const start = async () => {
      try {
        if (!appt) {
          setError("Falta el ID de la cita.");
          return;
        }
        const appointment: any = await getAppointmentById(appt);
        if (!appointment) {
          setError("No se encontró la cita.");
          return;
        }
        const meetingDataRaw = appointment.meetingData;
        const meetingData = typeof meetingDataRaw === "string" ? JSON.parse(meetingDataRaw) : meetingDataRaw;
        const attendeeId = role === "pro" ? appointment.proAttendeeId : appointment.clientAttendeeId;
        const joinToken = role === "pro" ? appointment.proJoinToken : appointment.clientJoinToken;

        if (!meetingData || !attendeeId || !joinToken) {
          setError("La reunión no está lista aún.");
          return;
        }
        if (tokenParam && tokenParam !== joinToken) {
          setError("Token inválido para esta reunión.");
          return;
        }

        const meetingResponse = { Meeting: meetingData };
        const attendeeResponse = { Attendee: { AttendeeId: attendeeId, JoinToken: joinToken } };

        const logger = new ConsoleLogger("fiskal-chime", LogLevel.INFO);
        const deviceController = new DefaultDeviceController(logger);
        const configuration = new MeetingSessionConfiguration(meetingResponse, attendeeResponse);
        const meetingSession = new DefaultMeetingSession(configuration, logger, deviceController);
        meetingSessionRef.current = meetingSession;

        const audioVideo = meetingSession.audioVideo;
        audioVideo.addObserver({
          videoTileDidUpdate: (tileState) => {
            if (!tileState.tileId || tileState.isContent) return;
            if (tileState.localTile) {
              localTileIdRef.current = tileState.tileId;
              if (localVideoRef.current) {
                audioVideo.bindVideoElement(tileState.tileId, localVideoRef.current);
              }
            } else {
              remoteTileIdRef.current = tileState.tileId;
              if (remoteVideoRef.current) {
                audioVideo.bindVideoElement(tileState.tileId, remoteVideoRef.current);
              }
            }
          },
          videoTileWasRemoved: (tileId) => {
            if (localTileIdRef.current === tileId) localTileIdRef.current = null;
            if (remoteTileIdRef.current === tileId) remoteTileIdRef.current = null;
          },
        });

        if (audioRef.current) {
          audioVideo.bindAudioElement(audioRef.current);
        }

        const audioInputs = await audioVideo.listAudioInputDevices();
        if (audioInputs[0]) {
          await audioVideo.startAudioInput(audioInputs[0].deviceId);
        }
        const videoInputs = await audioVideo.listVideoInputDevices();
        if (videoInputs[0]) {
          await audioVideo.startVideoInput(videoInputs[0].deviceId);
        }

        audioVideo.start();
        audioVideo.startLocalVideoTile();
        if (mounted) setStatus("Conectado");
      } catch (err: any) {
        setError(err?.message || "No se pudo iniciar la llamada.");
      }
    };
    start();

    return () => {
      mounted = false;
      const meetingSession = meetingSessionRef.current;
      if (meetingSession) {
        meetingSession.audioVideo.stop();
      }
    };
  }, [appt, role, tokenParam]);

  return (
    <div style={{ background: "#001a2c", minHeight: "100vh", padding: "40px", color: "white" }}>
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#003a57",
          padding: "30px",
          borderRadius: "15px",
          border: "1px solid #00e5ff",
        }}
      >
        <h1 style={{ color: "#00e5ff" }}>Videollamada</h1>
        {error && <p style={{ color: "#ffb4b4" }}>{error}</p>}
        {!error && <p style={{ color: "#9adfff" }}>{status}</p>}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "20px" }}>
          <div style={{ background: "#001a2c", border: "1px solid #00e5ff", borderRadius: "10px", padding: "10px" }}>
            <div style={{ marginBottom: "8px", color: "#9adfff" }}>Tu video</div>
            <video ref={localVideoRef} style={{ width: "100%", borderRadius: "8px" }} autoPlay playsInline muted />
          </div>
          <div style={{ background: "#001a2c", border: "1px solid #00e5ff", borderRadius: "10px", padding: "10px" }}>
            <div style={{ marginBottom: "8px", color: "#9adfff" }}>Cliente / Profesional</div>
            <video ref={remoteVideoRef} style={{ width: "100%", borderRadius: "8px" }} autoPlay playsInline />
          </div>
        </div>
        <audio ref={audioRef} style={{ display: "none" }} />
      </div>
    </div>
  );
}
