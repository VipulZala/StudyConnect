// src/components/Whiteboard.tsx
import { useEffect, useRef, useState } from 'react';
import { getSocket } from '../lib/socket';

type StrokePoint = { x: number; y: number };
type Stroke = { id: string; color: string; width: number; points: StrokePoint[] };

export default function Whiteboard({ roomId }: { roomId: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);
  const [color, setColor] = useState('#111827');
  const [width, setWidth] = useState(3);
  const currentStroke = useRef<Stroke | null>(null);
  const socket = getSocket();

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    canvas.style.width = `${canvas.clientWidth}px`;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;

    // receive remote strokes
    socket.on('whiteboard-stroke', (stroke: Stroke) => {
      drawStroke(stroke);
    });

    socket.on('whiteboard-clear', () => {
      clearCanvas(false);
    });

    return () => {
      socket.off('whiteboard-stroke');
      socket.off('whiteboard-clear');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = (x: number, y: number) => {
    drawing.current = true;
    const s: Stroke = { id: cryptoRandomId(), color, width, points: [{ x, y }] };
    currentStroke.current = s;
  };

  const move = (x: number, y: number) => {
    if (!drawing.current || !currentStroke.current) return;
    currentStroke.current.points.push({ x, y });
    drawStrokeSegment(currentStroke.current);
  };

  const end = () => {
    if (!drawing.current || !currentStroke.current) return;
    // emit stroke to others
    socket.emit('whiteboard-stroke', { roomId, stroke: currentStroke.current });
    drawing.current = false;
    currentStroke.current = null;
  };

  function drawStroke(stroke: Stroke) {
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.beginPath();
    const pts = stroke.points;
    if (pts.length === 1) {
      const p = pts[0];
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + 0.01, p.y + 0.01);
    } else {
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
    }
    ctx.stroke();
  }

  function drawStrokeSegment(stroke: Stroke) {
    // draws only last 2 points for speed
    if (!ctxRef.current) return;
    const pts = stroke.points;
    const len = pts.length;
    if (len < 2) return;
    const ctx = ctxRef.current;
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.beginPath();
    const a = pts[len - 2];
    const b = pts[len - 1];
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  function clearCanvas(emit = true) {
    const canvas = canvasRef.current!;
    const ctx = ctxRef.current!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (emit) socket.emit('whiteboard-clear', { roomId });
  }

  // pointer event handlers (works mouse + touch)
  useEffect(() => {
    const canvas = canvasRef.current!;
    const rect = () => canvas.getBoundingClientRect();

    const toPos = (clientX: number, clientY: number) => {
      const r = rect();
      const x = (clientX - r.left);
      const y = (clientY - r.top);
      return { x, y };
    };

    const onPointerDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      const pos = toPos(e.clientX, e.clientY);
      start(pos.x, pos.y);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!drawing.current) return;
      const pos = toPos(e.clientX, e.clientY);
      move(pos.x, pos.y);
    };
    const onPointerUp = (e: PointerEvent) => {
      canvas.releasePointerCapture(e.pointerId);
      end();
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, color, width]);

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <div className="d-flex gap-2 align-items-center p-2 bg-light border-bottom">
        <div className="d-flex align-items-center gap-2">
          <button onClick={() => setColor('#111827')} className="rounded-circle border" style={{ width: '28px', height: '28px', background: '#111827' }} />
          <button onClick={() => setColor('#ef4444')} className="rounded-circle border" style={{ width: '28px', height: '28px', background: '#ef4444' }} />
          <button onClick={() => setColor('#f59e0b')} className="rounded-circle border" style={{ width: '28px', height: '28px', background: '#f59e0b' }} />
          <button onClick={() => setColor('#10b981')} className="rounded-circle border" style={{ width: '28px', height: '28px', background: '#10b981' }} />
          <input type="range" min={1} max={12} value={width} onChange={(e) => setWidth(Number(e.target.value))} className="form-range" style={{ width: '100px' }} />
        </div>
        <div className="ms-auto d-flex gap-2">
          <button className="btn btn-danger btn-sm" onClick={() => clearCanvas(true)}>Clear</button>
        </div>
      </div>

      <div className="flex-grow-1 position-relative">
        <canvas ref={canvasRef} className="w-100 h-100 bg-white" />
      </div>
    </div>
  );
}

function cryptoRandomId() {
  return (Math.random().toString(36).substr(2, 9));
}
