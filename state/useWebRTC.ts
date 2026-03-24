"use client";

import { useEffect, useRef, useState } from "react";

interface UseWebRTCProps {
  sendWS: (data: any) => void;
  conversationId: string | null;
}

type CallType = "audio" | "video";

export function useWebRTC({ sendWS, conversationId }: UseWebRTCProps) {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const [isInCall, setIsInCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{
    from: string;
    type: CallType;
    offer: RTCSessionDescriptionInit;
  } | null>(null);

  const [callStatus, setCallStatus] = useState<"idle" | "ringing" | "inCall">("idle");

  const audioRingRef = useRef<HTMLAudioElement | null>(null);

  /* ────────────── Utils ────────────── */
  const getMedia = async (video: boolean) => {
    try {
      return await navigator.mediaDevices.getUserMedia({ audio: true, video });
    } catch (err) {
      alert("Autorisation micro/caméra refusée ou périphérique introuvable");
      throw err;
    }
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

    pc.onicecandidate = (e) => {
      if (e.candidate) sendWS({ type: "call.ice", candidate: e.candidate, conversationId });
    };

    pc.ontrack = (e) => {
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream();
      }
      e.streams[0].getTracks().forEach(track => remoteStreamRef.current!.addTrack(track));
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStreamRef.current;
    };

    return pc;
  };

  /* ────────────── Start Call ────────────── */
  const startCall = async (video: boolean) => {
    if (!conversationId) return;
    setCallStatus("inCall");

    const stream = await getMedia(video);
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    const pc = createPeerConnection();
    pcRef.current = pc;
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    sendWS({ type: "call.offer", offer, callType: video ? "video" : "audio", conversationId });
    setIsInCall(true);
  };

  /* ────────────── Accept Call ────────────── */
  const acceptCall = async () => {
    if (!incomingCall || !conversationId) return;
    stopRingtone();

    setCallStatus("inCall");

    const stream = await getMedia(incomingCall.type === "video");
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    const pc = createPeerConnection();
    pcRef.current = pc;
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    sendWS({ type: "call.answer", answer, conversationId });

    setIncomingCall(null);
    setIsInCall(true);
  };

  /* ────────────── End Call ────────────── */
  const endCall = () => {
    pcRef.current?.close();
    pcRef.current = null;

    localStreamRef.current?.getTracks().forEach(track => track.stop());
    localStreamRef.current = null;
    remoteStreamRef.current = null;

    setIsInCall(false);
    setCallStatus("idle");
    setIncomingCall(null);
    stopRingtone();
  };

  /* ────────────── Ringtone ────────────── */
  const playRingtone = () => {
    if (audioRingRef.current) {
      audioRingRef.current.currentTime = 0;
      audioRingRef.current.play().catch(() => {});
    }
  };

  const stopRingtone = () => {
    if (audioRingRef.current) {
      audioRingRef.current.pause();
      audioRingRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    return () => {
      endCall();
    };
  }, []);

  return {
    localVideoRef,
    remoteVideoRef,
    isInCall,
    incomingCall,
    callStatus,
    startCall,
    acceptCall,
    endCall,
    audioRingRef,
  };
}
