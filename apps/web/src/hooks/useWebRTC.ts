import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000';

interface PeerConnectionMap {
  [socketId: string]: RTCPeerConnection;
}

export const useWebRTC = (roomId: string) => {
  const [peers, setPeers] = useState<{ id: string; stream: MediaStream }[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const peerConnections = useRef<PeerConnectionMap>({});
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        socketRef.current?.emit('join-room', roomId, socketRef.current.id);

        socketRef.current?.on('user-connected', (userId: string) => {
          connectToNewUser(userId, stream);
        });

        socketRef.current?.on('offer', async (offer: RTCSessionDescriptionInit, callerId: string) => {
          const peerConnection = createPeerConnection(callerId, stream);
          await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socketRef.current?.emit('answer', answer, callerId);
        });

        socketRef.current?.on('answer', async (answer: RTCSessionDescriptionInit, callerId: string) => {
          const peerConnection = peerConnections.current[callerId];
          if (peerConnection) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          }
        });

        socketRef.current?.on('ice-candidate', (candidate: RTCIceCandidateInit, callerId: string) => {
          const peerConnection = peerConnections.current[callerId];
          if (peerConnection) {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          }
        });

        socketRef.current?.on('user-disconnected', (userId: string) => {
          if (peerConnections.current[userId]) {
            peerConnections.current[userId].close();
            delete peerConnections.current[userId];
            setPeers((prev) => prev.filter((p) => p.id !== userId));
          }
        });
      })
      .catch((err) => console.error('Failed to get local stream', err));

    return () => {
      socketRef.current?.disconnect();
      localStream?.getTracks().forEach((track) => track.stop());
      Object.values(peerConnections.current).forEach((pc) => pc.close());
    };
  }, [roomId]);

  const createPeerConnection = (targetId: string, stream: MediaStream) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    peerConnections.current[targetId] = pc;

    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit('ice-candidate', event.candidate, targetId);
      }
    };

    pc.ontrack = (event) => {
      setPeers((prevPeers) => {
        const existingPeer = prevPeers.find((p) => p.id === targetId);
        if (existingPeer) return prevPeers;
        return [...prevPeers, { id: targetId, stream: event.streams[0] }];
      });
    };

    return pc;
  };

  const connectToNewUser = async (userId: string, stream: MediaStream) => {
    const pc = createPeerConnection(userId, stream);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketRef.current?.emit('offer', offer, userId);
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;
    }
  };

  return { localVideoRef, peers, toggleMute, toggleVideo };
};
