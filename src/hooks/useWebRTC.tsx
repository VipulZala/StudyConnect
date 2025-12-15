// src/hooks/useWebRTC.tsx
import { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';
import type { Instance as SimplePeerInstance } from 'simple-peer';
import { v4 as uuidv4 } from 'uuid';
import { getSocket } from '../lib/socket';

export type PeerRecord = {
  id: string;
  peer: SimplePeerInstance;
  stream?: MediaStream;
};

export function useWebRTC(roomId: string | null) {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [peers, setPeers] = useState<PeerRecord[]>([]);
  const peerConnections = useRef<Record<string, SimplePeerInstance>>({});

  const socket = getSocket();

  // -------------------------------------
  // 1) Start local camera/mic
  // -------------------------------------
  async function startLocalStream(video = true, audio = true) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video,
        audio,
      });

      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.muted = true;
        await localVideoRef.current.play().catch(() => {});
      }

      return stream;
    } catch (err) {
      console.error('getUserMedia failed:', err);
      throw err;
    }
  }

  // -------------------------------------
  // 2) Cleanup when leaving or switching mode
  // -------------------------------------
  async function stopAll() {
    Object.values(peerConnections.current).forEach(p => p.destroy());
    peerConnections.current = {};
    setPeers([]);

    localStreamRef.current?.getTracks().forEach(t => t.stop());
    localStreamRef.current = null;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (roomId) {
      socket.emit('leave-room', { roomId });
    }
  }

  // -------------------------------------
  // 3) Join the WebRTC room over Socket.IO
  // -------------------------------------
  useEffect(() => {
    if (!roomId) return;

    socket.emit('join-room', { roomId });

    socket.on('room-users', (users: { id: string }[]) => {
      users.forEach(u => {
        if (u.id !== socket.id) {
          createPeerConnection(u.id, true);
        }
      });
    });

    socket.on('user-joined', ({ id }: { id: string }) => {
      if (id !== socket.id) {
        createPeerConnection(id, true);
      }
    });

    socket.on('signal', ({ from, data }: { from: string; data: any }) => {
      handleSignal(from, data);
    });

    socket.on('user-left', ({ id }: { id: string }) => {
      if (peerConnections.current[id]) {
        peerConnections.current[id].destroy();
        delete peerConnections.current[id];
        setPeers(prev => prev.filter(p => p.id !== id));
      }
    });

    return () => {
      socket.off('room-users');
      socket.off('user-joined');
      socket.off('signal');
      socket.off('user-left');
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // -------------------------------------
  // 4) Create WebRTC peer (initiator / receiver)
  // -------------------------------------
  async function createPeerConnection(targetId: string, initiator: boolean) {
    if (!localStreamRef.current) {
      await startLocalStream(true, true);
    }

    const peer = new SimplePeer({
      initiator,
      trickle: true,
      stream: localStreamRef.current!,
    });

    // Each peer sends signaling data
    peer.on('signal', data => {
      socket.emit('signal', { to: targetId, data });
    });

    // Receive remote stream
    peer.on('stream', (remoteStream: MediaStream) => {
      console.log('Remote stream from:', targetId);
      setPeers(prev => {
        const existing = prev.find(p => p.id === targetId);
        if (existing) return prev.map(p => p.id === targetId ? { ...p, stream: remoteStream } : p);
        return [...prev, { id: targetId, peer, stream: remoteStream }];
      });
    });

    peer.on('close', () => {
      peer.destroy();
      delete peerConnections.current[targetId];
      setPeers(prev => prev.filter(p => p.id !== targetId));
    });

    peer.on('error', err => console.warn('Peer error:', err));

    peerConnections.current[targetId] = peer;
  }

  // -------------------------------------
  // 5) Handle incoming WebRTC signals
  // -------------------------------------
  async function handleSignal(fromId: string, data: any) {
    let peer = peerConnections.current[fromId];

    if (!peer) {
      // Create non-initiator peer
      await createPeerConnection(fromId, false);
      peer = peerConnections.current[fromId];
    }

    try {
      peer.signal(data);
    } catch (err) {
      console.error('peer.signal failed:', err);
    }
  }

  // -------------------------------------
  // Returned API for StudyRoom
  // -------------------------------------
  return {
    localVideoRef,
    peers,
    startLocalStream,
    stopAll,
  };
}
