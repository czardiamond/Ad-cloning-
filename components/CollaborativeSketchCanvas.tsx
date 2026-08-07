import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Undo2, Trash2, Save, X, Palette, Circle, Square, MoveRight, Layers, Check } from 'lucide-react';
import { SketchStroke } from '../types';

interface CollaborativeSketchCanvasProps {
  isOpen: boolean;
  onClose: () => void;
  currentTime: number;
  videoDuration: number;
  onSaveSketchNote?: (timestamp: number, sketchDataUrl: string) => void;
}

const COLORS = ['#FF4B4B', '#FFD600', '#00E5FF', '#FFFFFF', '#00FF66'];
const SIZES = [2, 4, 8, 12];

const CollaborativeSketchCanvas: React.FC<CollaborativeSketchCanvasProps> = ({
  isOpen,
  onClose,
  currentTime,
  videoDuration,
  onSaveSketchNote
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedSize, setSelectedSize] = useState(4);
  const [tool, setTool] = useState<'pen' | 'arrow' | 'rect'>('pen');
  const [strokes, setStrokes] = useState<{ id: string; url: string; timestamp: number }[]>([]);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const startPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.parentElement?.clientWidth || 640;
      canvas.height = canvas.parentElement?.clientHeight || 360;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    startPos.current = { x, y };

    const ctx = canvas.getContext('2d');
    if (ctx && tool === 'pen') {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = selectedSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    if (tool === 'pen') {
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    if (tool === 'arrow') {
      drawArrow(ctx, startPos.current.x, startPos.current.y, endX, endY, selectedColor, selectedSize);
    } else if (tool === 'rect') {
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = selectedSize;
      ctx.strokeRect(startPos.current.x, startPos.current.y, endX - startPos.current.x, endY - startPos.current.y);
    }

    setIsDrawing(false);
    startPos.current = null;
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, fromx: number, fromy: number, tox: number, toy: number, color: string, width: number) => {
    const headlen = 12;
    const dx = tox - fromx;
    const dy = toy - fromy;
    const angle = Math.atan2(dy, dx);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;

    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    if (onSaveSketchNote) {
      onSaveSketchNote(currentTime, dataUrl);
    }
    setStrokes((prev) => [...prev, { id: Date.now().toString(), url: dataUrl, timestamp: currentTime }]);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  return (
    <div className="absolute inset-0 z-40 pointer-events-auto bg-black/40 backdrop-blur-sm flex flex-col justify-between p-4 rounded-[24px] border-2 border-[#D0BCFF]">
      {/* Top Sketch Toolbar */}
      <div className="flex items-center justify-between bg-[#1E1E1E]/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-xl z-50">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#2C2C2C] p-1 rounded-full border border-white/5">
            <button
              onClick={() => setTool('pen')}
              className={`p-1.5 rounded-full transition-colors ${tool === 'pen' ? 'bg-[#D0BCFF] text-[#381E72]' : 'text-[#8E918F] hover:text-white'}`}
              title="Freehand Pen"
            >
              <PenTool className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTool('arrow')}
              className={`p-1.5 rounded-full transition-colors ${tool === 'arrow' ? 'bg-[#D0BCFF] text-[#381E72]' : 'text-[#8E918F] hover:text-white'}`}
              title="Draw Arrow"
            >
              <MoveRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTool('rect')}
              className={`p-1.5 rounded-full transition-colors ${tool === 'rect' ? 'bg-[#D0BCFF] text-[#381E72]' : 'text-[#8E918F] hover:text-white'}`}
              title="Rectangle Box"
            >
              <Square className="w-4 h-4" />
            </button>
          </div>

          <div className="h-4 w-px bg-white/10 mx-1" />

          {/* Color Palette */}
          <div className="flex items-center gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`w-5 h-5 rounded-full transition-transform ${selectedColor === c ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="h-4 w-px bg-white/10 mx-1" />

          {/* Size Selector */}
          <div className="flex items-center gap-1">
            {SIZES.map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${selectedSize === sz ? 'bg-white text-black' : 'text-[#8E918F] hover:text-white'}`}
              >
                {sz}px
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={clearCanvas}
            className="p-1.5 bg-[#2C2C2C] hover:bg-white/10 text-[#8E918F] hover:text-white rounded-full transition-colors"
            title="Clear Drawing"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 bg-[#D0BCFF] hover:bg-[#A8C7FA] text-[#381E72] rounded-full text-xs font-bold transition-all flex items-center gap-1 shadow-md"
          >
            {isSavedNotice ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Save className="w-3.5 h-3.5" />}
            {isSavedNotice ? 'Saved!' : 'Pin to Frame'}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 bg-[#2C2C2C] hover:bg-white/10 text-[#8E918F] hover:text-white rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative flex-1 w-full h-full cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Frame Timestamp Badge */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono text-[#D0BCFF] border border-white/10 flex items-center gap-1.5 pointer-events-none">
        <PenTool className="w-3 h-3" /> Sketching at {currentTime.toFixed(1)}s frame
      </div>
    </div>
  );
};

export default CollaborativeSketchCanvas;
