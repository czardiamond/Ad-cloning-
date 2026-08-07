import React from 'react';
import { GridOverlayMode, ColorVisualizerMode } from '../types';

interface GridOverlayProps {
  gridMode: GridOverlayMode;
  visualizerMode: ColorVisualizerMode;
  filterId: string;
}

const GridOverlay: React.FC<GridOverlayProps> = ({ gridMode, visualizerMode, filterId }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {/* 1. Grid Modes */}
      {gridMode === 'rule-of-thirds' && (
        <div className="w-full h-full relative border border-white/20">
          {/* Vertical Lines */}
          <div className="absolute left-[33.33%] top-0 bottom-0 w-px bg-white/30 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
          <div className="absolute left-[66.66%] top-0 bottom-0 w-px bg-white/30 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
          {/* Horizontal Lines */}
          <div className="absolute top-[33.33%] left-0 right-0 h-px bg-white/30 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
          <div className="absolute top-[66.66%] left-0 right-0 h-px bg-white/30 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
          {/* Intersection Points */}
          <div className="absolute left-[33.33%] top-[33.33%] w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-indigo-500/80" />
          <div className="absolute left-[66.66%] top-[33.33%] w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-indigo-500/80" />
          <div className="absolute left-[33.33%] top-[66.66%] w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-indigo-500/80" />
          <div className="absolute left-[66.66%] top-[66.66%] w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-indigo-500/80" />
        </div>
      )}

      {gridMode === 'golden-ratio' && (
        <div className="w-full h-full relative border border-amber-300/30">
          {/* Golden Ratio lines (38.2% and 61.8%) */}
          <div className="absolute left-[38.2%] top-0 bottom-0 w-px bg-amber-300/40 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
          <div className="absolute left-[61.8%] top-0 bottom-0 w-px bg-amber-300/40 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
          <div className="absolute top-[38.2%] left-0 right-0 h-px bg-amber-300/40 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
          <div className="absolute top-[61.8%] left-0 right-0 h-px bg-amber-300/40 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
        </div>
      )}

      {gridMode === 'center-cross' && (
        <div className="w-full h-full relative">
          {/* Center Crosshair */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-emerald-400/50" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-400/50" />
          <div className="absolute left-1/2 top-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/80" />

          {/* Action Safe Margin (10%) */}
          <div className="absolute inset-[10%] border border-dashed border-emerald-400/30 rounded-lg">
            <span className="absolute top-1 left-2 text-[9px] text-emerald-400/60 font-mono">ACTION SAFE 90%</span>
          </div>

          {/* Title Safe Margin (20%) */}
          <div className="absolute inset-[20%] border border-dashed border-cyan-400/40 rounded-lg">
            <span className="absolute top-1 left-2 text-[9px] text-cyan-400/70 font-mono">TITLE SAFE 80%</span>
          </div>
        </div>
      )}

      {/* 2. Luminance Heatmap Visualizer Overlay */}
      {visualizerMode === 'heatmap' && (
        <div className="w-full h-full relative mix-blend-overlay opacity-75 transition-all duration-300">
          {/* Heatmap gradient overlay reacting to filterId */}
          {filterId === 'grayscale' && (
            <div className="w-full h-full bg-gradient-to-tr from-blue-900/60 via-purple-900/40 to-cyan-500/50" />
          )}
          {filterId === 'contrast' && (
            <div className="w-full h-full bg-gradient-to-tr from-blue-900/80 via-emerald-500/30 to-red-600/70" />
          )}
          {filterId === 'brightness' && (
            <div className="w-full h-full bg-gradient-to-tr from-cyan-900/40 via-yellow-500/50 to-red-500/80" />
          )}
          {filterId === 'sepia' && (
            <div className="w-full h-full bg-gradient-to-tr from-indigo-900/50 via-amber-600/50 to-amber-300/60" />
          )}
          {filterId === 'cool' && (
            <div className="w-full h-full bg-gradient-to-tr from-blue-950/80 via-cyan-600/50 to-emerald-400/40" />
          )}
          {filterId === 'none' && (
            <div className="w-full h-full bg-gradient-to-tr from-blue-900/50 via-emerald-500/30 to-yellow-500/60" />
          )}

          {/* Zebra stripes clipping indicator overlay */}
          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 text-[10px] font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white font-bold">LUMINANCE HEATMAP</span>
            <span className="text-[#8E918F]">(Blue: Shadows &lt; 20% | Green: Midtones | Red: Clipping &gt; 80%)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GridOverlay;
