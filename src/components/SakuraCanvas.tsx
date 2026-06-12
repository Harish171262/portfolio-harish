import React, { useEffect, useRef } from 'react';
import { SakuraSystemConfig } from '../types';

interface SakuraCanvasProps {
  config: SakuraSystemConfig;
}

export default function SakuraCanvas({ config }: SakuraCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Parallax layers structure
    // Petal interface
    interface Petal {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      angle: number;
      spinSpeed: number;
      layer: number; // 0 (back, slow, small) to 2 (front, fast, large)
      color: string;
      flip: number;
      flipSpeed: number;
    }

    interface MistParticle {
      x: number;
      y: number;
      radius: number;
      opacity: number;
      speedX: number;
    }

    interface PollenParticle {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      amplitude: number;
      frequency: number;
    }

    const petals: Petal[] = [];
    const mistParticles: MistParticle[] = [];
    const pollenParticles: PollenParticle[] = [];

    // Colors matching theme
    const petalColors = [config.colorHex, '#FF9EB5', '#FAF6F0', '#FFE6EB'];

    // Generate Petals
    const createPetal = (isInitial = false): Petal => {
      const layer = Math.floor(Math.random() * 3); // 3 layers for parallax
      const size = Math.random() * 8 + 5 + layer * 3; // larger in front
      const speedY = (Math.random() * config.maxSpeed + config.minSpeed) * (0.6 + layer * 0.2);
      const speedX = (Math.random() * 0.4 - 0.2) + config.windSpeed;
      
      return {
        x: Math.random() * width,
        y: isInitial ? Math.random() * height : -20,
        size,
        speedY,
        speedX,
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
        layer,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        flip: Math.random(),
        flipSpeed: Math.random() * 0.03 + 0.01
      };
    };

    // Populate initial entities
    for (let i = 0; i < config.petalCount; i++) {
      petals.push(createPetal(true));
    }

    // Populate mist (3 items for abstract slow drift)
    for (let i = 0; i < 4; i++) {
      mistParticles.push({
        x: Math.random() * width,
        y: height * 0.6 + Math.random() * height * 0.3,
        radius: Math.random() * 150 + 100,
        opacity: Math.random() * 0.06 + 0.02,
        speedX: Math.random() * 0.15 + 0.05
      });
    }

    // Populate floating gold / soft pollen (25 pieces)
    for (let i = 0; i < 20; i++) {
      pollenParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        speedY: -(Math.random() * 0.3 + 0.1),
        amplitude: Math.random() * 1.5 + 0.5,
        frequency: Math.random() * 0.02 + 0.005
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Mist / Layered Parallax Clouds
      ctx.save();
      mistParticles.forEach((mist) => {
        mist.x += mist.speedX;
        if (mist.x - mist.radius > width) {
          mist.x = -mist.radius;
        }

        const gradient = ctx.createRadialGradient(
          mist.x,
          mist.y,
          0,
          mist.x,
          mist.y,
          mist.radius
        );
        gradient.addColorStop(0, `rgba(248, 182, 193, ${mist.opacity})`);
        gradient.addColorStop(0.5, `rgba(244, 238, 231, ${mist.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(18, 18, 18, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mist.x, mist.y, mist.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 2. Draw pollen / soft dust particles (background pollen)
      ctx.save();
      ctx.fillStyle = '#D4AF37'; // gold
      pollenParticles.forEach((p, idx) => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * p.frequency) * p.amplitude * 0.1 + config.windSpeed * 0.1;

        if (p.y < -5) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }

        ctx.globalAlpha = 0.35 + Math.sin(idx + p.y * 0.01) * 0.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 3. Draw Sakura Petals with Parallax Layers
      // Sort by layer so closer petals are drawn on top (layer 0 -> layer 1 -> layer 2)
      petals.sort((a, b) => a.layer - b.layer);

      petals.forEach((p, index) => {
        // Move petals
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.01) * config.turbulence;
        p.angle += p.spinSpeed;
        p.flip += p.flipSpeed;

        // Reset if out of bounds
        if (p.y > height + 20 || p.x > width + 20 || p.x < -20) {
          petals[index] = createPetal(false);
          return;
        }

        // Draw individual petal
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        
        // Perspective scaling based on layer
        const scaleX = Math.sin(p.flip);
        ctx.scale(scaleX, 1);

        // Petal shape (organic teardrop design)
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#FF9EB5';
        ctx.shadowBlur = p.layer === 2 ? 6 : 2; // subtle glow for front particles

        // Draw elegant curvature
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          -p.size / 2, -p.size / 2,
          -p.size, p.size / 3,
          0, p.size
        );
        ctx.bezierCurveTo(
          p.size, p.size / 3,
          p.size / 2, -p.size / 2,
          0, 0
        );

        ctx.fill();

        // Draw little fold vein
        ctx.beginPath();
        ctx.strokeStyle = '#FFE6EB';
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 0.75;
        ctx.moveTo(0, 0);
        ctx.lineTo(0, p.size * 0.85);
        ctx.stroke();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [config]);

  return (
    <canvas
      ref={canvasRef}
      id="sakura-canvas"
      className="fixed inset-0 pointer-events-none z-5"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
