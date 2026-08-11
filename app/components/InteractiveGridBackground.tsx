"use client";

import { useEffect, useRef, useState } from "react";

interface GridCell {
  row: number;
  col: number;
}

export default function InteractiveGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  
  const gridSize = 50; // Size of each grid cell
  const highlightFade = useRef<Map<string, number>>(new Map<string, number>());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseLeave = () => {
      setMousePos(null);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.width / gridSize);
      const rows = Math.ceil(canvas.height / gridSize);

      // Get current mouse grid position
      let currentRow = -1;
      let currentCol = -1;
      
      if (mousePos) {
        currentCol = Math.floor(mousePos.x / gridSize);
        currentRow = Math.floor(mousePos.y / gridSize);
      }

      // Update highlight fade values
      const newFadeMap = new Map<string, number>();
      
      if (currentRow >= 0 && currentCol >= 0) {
        // Add current position with full opacity
        for (let r = 0; r < rows; r++) {
          const key = `row-${currentRow}-${r}`;
          newFadeMap.set(key, 1);
        }
        for (let c = 0; c < cols; c++) {
          const key = `col-${c}-${currentRow}`;
          newFadeMap.set(key, 1);
        }
      }

      // Fade out old highlights
      highlightFade.current.forEach((value, key) => {
        if (!newFadeMap.has(key)) {
          const newValue = value - 0.05;
          if (newValue > 0) {
            newFadeMap.set(key, newValue);
          }
        }
      });

      highlightFade.current = newFadeMap;

      // Draw grid
      ctx.strokeStyle = "rgba(156, 163, 175, 0.15)"; // gray-400 with low opacity
      ctx.lineWidth = 1;

      // Draw vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw highlighted cells
      highlightFade.current.forEach((opacity, key) => {
        const parts = key.split("-");
        const type = parts[0];
        
        if (type === "row") {
          const row = parseInt(parts[1]);
          const col = parseInt(parts[2]);
          
          ctx.fillStyle = `rgba(16, 185, 129, ${opacity * 0.15})`; // emerald-500
          ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
        } else if (type === "col") {
          const col = parseInt(parts[1]);
          const row = parseInt(parts[2]);
          
          ctx.fillStyle = `rgba(16, 185, 129, ${opacity * 0.15})`; // emerald-500
          ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
        }
      });

      // Draw highlight borders for current row and column
      if (currentRow >= 0 && currentCol >= 0) {
        ctx.strokeStyle = "rgba(16, 185, 129, 0.4)"; // emerald-500
        ctx.lineWidth = 2;
        
        // Highlight current row
        ctx.strokeRect(0, currentRow * gridSize, canvas.width, gridSize);
        
        // Highlight current column
        ctx.strokeRect(currentCol * gridSize, 0, gridSize, canvas.height);
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePos]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50 dark:opacity-30"
    />
  );
}
