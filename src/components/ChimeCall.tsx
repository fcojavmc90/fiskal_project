"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration,
} from "amazon-chime-sdk-js";
import { getAppointmentById } from "../lib/graphqlClient";
import { ensureAmplifyConfigured } from "../lib/amplifyClient";

type ChimeCallProps = {
  appointmentId: string;
  role: "client" | "pro";
  token?: string;
  embedded?: boolean;
  fullHeight?: boolean;
  onLeave?: () => void;
};

export default function ChimeCall({ appointmentId, role, token, embedded, fullHeight, onLeave }: ChimeCallProps) {
  ensureAmplifyConfigured();
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Conectando...");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const meetingSessionRef = useRef<DefaultMeetingSession | null>(null);
  const localTileIdRef = useRef<number | null>(null);
  const remoteTileIdRef = useRef<number | null>(null);
  const videoDeviceIdRef = useRef<string | null>(null);
  const videoWrapRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [localPos, setLocalPos] = useState({ x: 16, y: 16 });

  useEffect(() => {
    let mounted = true;
    const start = async () => {
      try {
        if (!appointmentId) {
          setError("Falta el ID de la cita.");
          return;
        }
        const appointment: any = await getAppointmentById(appointmentId);
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
        if (token && token !== joinToken) {
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
          videoDeviceIdRef.current = videoInputs[0].deviceId;
          await audioVideo.startVideoInput(videoInputs[0].deviceId);
        } else {
          setIsCameraOn(false);
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
  }, [appointmentId, role, token]);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!draggingRef.current || !videoWrapRef.current) return;
      const rect = videoWrapRef.current.getBoundingClientRect();
      const boxW = 220;
      const boxH = 140;
      const nextX = Math.min(Math.max(e.clientX - rect.left - dragOffsetRef.current.x, 8), rect.width - boxW - 8);
      const nextY = Math.min(Math.max(e.clientY - rect.top - dragOffsetRef.current.y, 8), rect.height - boxH - 8);
      setLocalPos({ x: nextX, y: nextY });
    };
    const handleUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, []);

  const toggleMute = () => {
    const audioVideo = meetingSessionRef.current?.audioVideo;
    if (!audioVideo) return;
    if (isMuted) {
      audioVideo.realtimeUnmuteLocalAudio();
      setIsMuted(false);
    } else {
      audioVideo.realtimeMuteLocalAudio();
      setIsMuted(true);
    }
  };

  const toggleCamera = async () => {
    const audioVideo = meetingSessionRef.current?.audioVideo;
    if (!audioVideo) return;
    if (isCameraOn) {
      audioVideo.stopLocalVideoTile();
      await audioVideo.stopVideoInput();
      setIsCameraOn(false);
      return;
    }
    const deviceId = videoDeviceIdRef.current;
    if (!deviceId) {
      const inputs = await audioVideo.listVideoInputDevices();
      if (inputs[0]) {
        videoDeviceIdRef.current = inputs[0].deviceId;
        await audioVideo.startVideoInput(inputs[0].deviceId);
      }
    } else {
      await audioVideo.startVideoInput(deviceId);
    }
    audioVideo.startLocalVideoTile();
    setIsCameraOn(true);
  };

  const leaveCall = () => {
    const meetingSession = meetingSessionRef.current;
    if (meetingSession) {
      meetingSession.audioVideo.stop();
    }
    if (onLeave) {
      onLeave();
      return;
    }
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const gridHeight = fullHeight ? "calc(100vh - 220px)" : "360px";

  return (
    <div style={{ color: "white", height: fullHeight ? "100%" : "auto" }}>
      {!embedded && <h1 style={{ color: "#00e5ff" }}>Videollamada</h1>}
      {error && <p style={{ color: "#ffb4b4" }}>{error}</p>}
      {!error && <p style={{ color: "#9adfff" }}>{status}</p>}

      <div
        ref={videoWrapRef}
        style={{
          position: "relative",
          marginTop: "20px",
          height: gridHeight,
          background: "#001a2c",
          border: "1px solid #00e5ff",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <video
          ref={remoteVideoRef}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          autoPlay
          playsInline
        />
        <div
          onPointerDown={(e) => {
            draggingRef.current = true;
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            dragOffsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
          }}
          style={{
            position: "absolute",
            top: localPos.y,
            left: localPos.x,
            width: "220px",
            height: "140px",
            background: "#001a2c",
            border: "1px solid #00e5ff",
            borderRadius: "10px",
            overflow: "hidden",
            cursor: "grab",
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
          }}
        >
          <video ref={localVideoRef} style={{ width: "100%", height: "100%", objectFit: "cover" }} autoPlay playsInline muted />
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
        <button
          onClick={toggleMute}
          style={{ background: isMuted ? "#ff6b6b" : "#00e5ff", border: "none", padding: "8px 12px", fontWeight: "bold", cursor: "pointer" }}
        >
          {isMuted ? "Activar micrófono" : "Silenciar micrófono"}
        </button>
        <button
          onClick={toggleCamera}
          style={{ background: isCameraOn ? "#00e5ff" : "#ff6b6b", border: "none", padding: "8px 12px", fontWeight: "bold", cursor: "pointer" }}
        >
          {isCameraOn ? "Apagar cámara" : "Encender cámara"}
        </button>
        <button
          onClick={leaveCall}
          style={{ background: "#ff6b6b", border: "none", padding: "8px 12px", fontWeight: "bold", cursor: "pointer" }}
        >
          Cerrar llamada
        </button>
      </div>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
}
