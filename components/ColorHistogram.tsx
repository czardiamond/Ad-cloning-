import React, { useMemo } from 'react';
import { Activity, Zap, RefreshCw } from 'lucide-react';

interface ColorHistogramProps {
  filterId: string;
  isVisible: boolean;
  onClose: () => void;
}

const ColorHistogram: React.FC<ColorHistogramProps> = ({ filterId, isVisible, onClose }) => {
  if (!isVisible) return null;

  // Generate dynamic histogram curve paths based on the selected Visual FX filter
  const histogramData = useMemo(() => {
    // 256 bins simulated across 32 points
    const points = 32;
    const r: number[] = [];
    const g: number[] = [];
    const b: number[] = [];
    const lum: number[] = [];

    for (let i = 0; i < points; i++) {
      const norm = i / (points - 1);
      let rVal = 0;
      let gVal = 0;
      let bVal = 0;

      if (filterId === 'none') {
        rVal = Math.sin(norm * Math.PI) * 70 + Math.random() * 5 + 15;
        gVal = Math.sin((norm + 0.05) * Math.PI) * 75 + Math.random() * 5 + 10;
        bVal = Math.sin((norm - 0.05) * Math.PI) * 65 + Math.random() * 5 + 20;
      } else if (filterId === 'grayscale') {
        const val = Math.sin(norm * Math.PI) * 80 + 10;
        rVal = val;
        gVal = val;
        bVal = val;
      } else if (filterId === 'sepia') {
        rVal = Math.sin(norm * Math.PI) * 85 + 15;
        gVal = Math.sin(norm * Math.PI) * 65 + 10;
        bVal = Math.sin(norm * Math.PI) * 35 + 5;
      } else if (filterId === 'contrast') {
        // High shadows and high highlights, dip in midtones
        const u = Math.pow(norm - 0.5, 2) * 200 + 10;
        rVal = u * 0.9;
        gVal = u * 0.95;
        bVal = u * 1.1;
      } else if (filterId === 'brightness') {
        // Shifted to the right (highlights)
        rVal = Math.sin(Math.pow(norm, 0.7) * Math.PI) * 90 + 5;
        gVal = Math.sin(Math.pow(norm, 0.7) * Math.PI) * 95 + 5;
        bVal = Math.sin(Math.pow(norm, 0.7) * Math.PI) * 85 + 5;
      } else if (filterId === 'cool') {
        rVal = Math.sin(norm * Math.PI) * 45 + 5;
        gVal = Math.sin(norm * Math.PI) * 70 + 15;
        bVal = Math.sin(norm * Math.PI) * 95 + 25;
      }

      r.push(Math.min(100, Math.max(0, rVal)));
      g.push(Math.min(100, Math.max(0, gVal)));
      b.push(Math.min(100, Math.max(0, bVal)));
      lum.push(Math.min(100, Math.max(0, (rVal * 0.299 + gVal * 0.587 + bVal * 0.114))));
    }

    // Convert array to SVG path string
    const toPath = (data: number[]) => {
      const width = 280;
      const height = 80;
      const dx = width / (data.length - 1);
      let path = `M 0 ${height - (data[0] / 100) * height}`;
      for (let i = 1; i < data.length; i++) {
        const x = i * dx;
        const y = height - (data[i] / 100) * height;
        path += ` L ${x} ${y}`;
      }
      path += ` L ${width} ${height} L 0 ${height} Z`;
      return path;
    };

    return {
      rPath: toPath(r),
      gPath: toPath(g),
      bPath: toPath(b),
      lumPath: toPath(lum),
      rData: r,
      gData: g,
      bData: b,
      lumData: lum
    };
  }, [filterId]);

  return (
    <div className="absolute bottom-4 left-4 z-30 bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-[24px] p-4 shadow-2xl w-80 animate-in slide-in-from-bottom-3 fade-in duration-200">
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#A8C7FA]" />
          <span className="text-xs font-bold text-[#E2E2E2] tracking-tight">RGB & Luminance Histogram</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono px-2 py-0.5 bg-[#2C2C2C] text-[#D0BCFF] rounded-full uppercase">
            FX: {filterId}
          </span>
          <button onClick={onClose} className="p-1 text-[#8E918F] hover:text-white rounded-full">
            ×
          </button>
        </div>
      </div>

      {/* SVG Canvas for Curves */}
      <div className="relative h-20 w-full bg-[#000000]/80 rounded-xl overflow-hidden border border-white/5 p-1">
        <svg viewBox="0 0 280 80" className="w-full h-full overflow-visible">
          {/* Grid background lines */}
          <line x1="70" y1="0" x2="70" y2="80" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 2" />
          <line x1="140" y1="0" x2="140" y2="80" stroke="rgba(255,255,255,0.1)" strokeDasharray="2 2" />
          <line x1="210" y1="0" x2="210" y2="80" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 2" />
          <line x1="0" y1="40" x2="280" y2="40" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 2" />

          {/* Red Channel */}
          <path d={histogramData.rPath} fill="rgba(239, 68, 68, 0.25)" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="1.5" />
          {/* Green Channel */}
          <path d={histogramData.gPath} fill="rgba(34, 197, 94, 0.25)" stroke="rgba(34, 197, 94, 0.8)" strokeWidth="1.5" />
          {/* Blue Channel */}
          <path d={histogramData.bPath} fill="rgba(59, 130, 246, 0.25)" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="1.5" />
          {/* Luminance Curve */}
          <path d={histogramData.lumPath} fill="none" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="2" strokeDasharray="3 1" />
        </svg>

        {/* Labels overlay */}
        <div className="absolute top-1 left-2 text-[9px] text-white/50 font-mono">0 (Shadows)</div>
        <div className="absolute top-1 right-2 text-[9px] text-white/50 font-mono">255 (Highlights)</div>
      </div>

      {/* Legend & Stats */}
      <div className="flex items-center justify-between text-[10px] text-[#8E918F] mt-2 font-mono">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"/> R</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"/> G</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block"/> B</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white inline-block"/> Lum</span>
      </div>
    </div>
  );
};

export default ColorHistogram;
