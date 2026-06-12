import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SpidermanSystemConfig } from '../types';

interface SpidermanCanvasProps {
  config: SpidermanSystemConfig;
  activeSection: string;
}

export default function SpidermanCanvas({ config, activeSection }: SpidermanCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({
    x: 100,
    y: 300,
    targetX: 100,
    targetY: 300,
    swingAngle: 0,
    swingRange: 25,
    swingSpeed: 0.02,
    ropeAnchorX: 300,
    ropeAnchorY: 0,
    webLength: 260,
    webShooting: false,
    webStrength: 0,
    webTargetX: 0,
    webTargetY: 0,
    poseTime: 0,
    flipActive: false,
    flipProgress: 0,
    selfieActive: false,
    selfieFlash: 0,
    greetingActive: false,
    eyesNarrow: 1,
    isMobile: false
  });

  useEffect(() => {
    if (!config.isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    stateRef.current.isMobile = width < 768;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      stateRef.current.isMobile = width < 768;
    };
    window.addEventListener('resize', handleResize);

    const state = stateRef.current;

    // Keep track of cursor position for dynamic web shooting / eyes tracking
    const mousePos = { x: width / 2, y: height / 2 };
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Dynamic web shooter on click
    const handleMouseClick = (e: MouseEvent) => {
      if (state.flipActive || state.selfieActive) return;

      // Check distance to Spidey to trigger fun animations
      const dx = e.clientX - state.x;
      const dy = e.clientY - state.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100) {
        // Spark an easter egg!
        const rand = Math.random();
        if (rand < 0.35) {
          triggerBackflip();
        } else if (rand < 0.7) {
          triggerSelfie();
        } else {
          triggerGreeting();
        }
      } else {
        // Shoot a web toward the point clicked!
        shootWeb(e.clientX, e.clientY);
      }
    };
    window.addEventListener('mousedown', handleMouseClick);

    // Easter Egg: Backflip GSAP animation
    const triggerBackflip = () => {
      if (state.flipActive) return;
      state.flipActive = true;
      state.eyesNarrow = 0.2; // intense focus

      gsap.to(state, {
        flipProgress: 1,
        duration: 1.1,
        ease: 'power3.inOut',
        onUpdate: () => {
          // Add extra jump force to the Y coordinate
          state.y -= Math.sin(state.flipProgress * Math.PI) * 110;
        },
        onComplete: () => {
          state.flipActive = false;
          state.flipProgress = 0;
          state.eyesNarrow = 1;
        }
      });
    };

    // Easter Egg: Selfie Pose GSAP
    const triggerSelfie = () => {
      if (state.selfieActive) return;
      state.selfieActive = true;
      gsap.to(state, {
        selfieFlash: 1,
        duration: 0.18,
        yoyo: true,
        repeat: 1,
        ease: 'power1.out',
        onComplete: () => {
          state.selfieActive = false;
          state.selfieFlash = 0;
        }
      });
    };

    // Easter egg: Wave hand greeting
    const triggerGreeting = () => {
      if (state.greetingActive) return;
      state.greetingActive = true;
      // wave several times
      gsap.to(state, {
        duration: 1.4,
        onComplete: () => {
          state.greetingActive = false;
        }
      });
    };

    // Web shoot effect
    const shootWeb = (tx: number, ty: number) => {
      state.webShooting = true;
      state.webTargetX = tx;
      state.webTargetY = ty;
      state.webStrength = 1;

      gsap.killTweensOf(state, 'webStrength');
      gsap.to(state, {
        webStrength: 0,
        duration: 0.65,
        ease: 'power2.out',
        onComplete: () => {
          state.webShooting = false;
        }
      });

      // Pull Spidey slightly toward the direction clicked (momentum simulation)
      gsap.to(state, {
        x: state.x + (tx - state.x) * 0.18,
        y: state.y + (ty - state.y) * 0.18,
        duration: 0.5,
        ease: 'power1.out'
      });
    };

    // Suit color palettes based on selection
    const getSuitColors = () => {
      switch (config.suitStyle) {
        case 'miles':
          return { primary: '#FF003C', secondary: '#1A1A1A', spider: '#FF003C', eyes: '#FFFFFF' };
        case 'iron_spider':
          return { primary: '#FF2A00', secondary: '#D4AF37', spider: '#D4AF37', eyes: '#37E6FF' };
        case 'glowing_sakura':
          return { primary: '#FF9EB5', secondary: '#FAF6F0', spider: '#FF9EB5', eyes: '#FFE6EB' };
        case 'classic':
        default:
          return { primary: '#E53E3E', secondary: '#2B6CB0', spider: '#1A202C', eyes: '#FFFFFF' };
      }
    };

    // Active Section Pose Mapper
    // Assign position guidelines based on active portfolio sections
    const updateTargetPositions = () => {
      const active = activeSection || 'home';
      state.ropeAnchorY = 0;

      if (active === 'home' || active === 'hero') {
        // Swing left-center
        state.ropeAnchorX = width * 0.3;
        state.targetX = width * 0.25;
        state.targetY = height * 0.55;
        state.webLength = state.isMobile ? 180 : 250;
        state.swingRange = 30;
        state.swingSpeed = 0.012;
      } else if (active === 'about') {
        // Sitting/Climbing representation on the left side
        state.ropeAnchorX = width * 0.05;
        state.targetX = width * 0.08;
        state.targetY = height * 0.4;
        state.webLength = 150;
        state.swingRange = 4;
        state.swingSpeed = 0.005;
      } else if (active === 'skills') {
        // High, shooting webs sideways, hanging
        state.ropeAnchorX = width * 0.85;
        state.targetX = width * 0.88;
        state.targetY = height * 0.25;
        state.webLength = 160;
        state.swingRange = 12;
        state.swingSpeed = 0.02;
      } else if (active === 'experience') {
        // Climbing down the right-center timeline
        state.ropeAnchorX = width * 0.8;
        state.targetX = width * 0.82;
        state.targetY = height * 0.65;
        state.webLength = 340;
        state.swingRange = 6;
        state.swingSpeed = 0.007;
      } else if (active === 'projects') {
        // Hanging low from top right corner
        state.ropeAnchorX = width * 0.9;
        state.targetX = width * 0.88;
        state.targetY = height * 0.5;
        state.webLength = 280;
        state.swingRange = 15;
        state.swingSpeed = 0.01;
      } else if (active === 'certifications' || active === 'achievements') {
        // Floating slightly on bottom-left, dynamic
        state.ropeAnchorX = width * 0.15;
        state.targetX = width * 0.12;
        state.targetY = height * 0.72;
        state.webLength = 360;
        state.swingRange = 18;
        state.swingSpeed = 0.015;
      } else if (active === 'github-leetcode' || active === 'blog') {
        // Side view, hanging
        state.ropeAnchorX = width * 0.92;
        state.targetX = width * 0.9;
        state.targetY = height * 0.35;
        state.webLength = 180;
        state.swingRange = 8;
        state.swingSpeed = 0.01;
      } else if (active === 'contact') {
        // Hanging upside down directly from top-center/right
        state.ropeAnchorX = width * 0.75;
        state.targetX = width * 0.75;
        state.targetY = height * 0.28;
        state.webLength = 190;
        state.swingRange = 10;
        state.swingSpeed = 0.018;
      }
    };

    // Frame loops execution
    const run = () => {
      updateTargetPositions();

      state.poseTime += 1;

      // 1. Calculate physics momentum & swing angle oscillation
      const active = activeSection || 'home';
      const angleOffset = Math.sin(state.poseTime * state.swingSpeed) * (state.swingRange * Math.PI / 180);
      
      // Calculate swinging coordinates relative to rope anchor
      let idealX = state.ropeAnchorX + Math.sin(angleOffset) * state.webLength;
      let idealY = state.ropeAnchorY + Math.cos(angleOffset) * state.webLength;

      if (active === 'contact') {
        // Strict upside down hanging - less drift
        idealX = state.ropeAnchorX + Math.sin(angleOffset * 0.45) * state.webLength;
        idealY = state.ropeAnchorY + Math.cos(angleOffset * 0.45) * state.webLength;
      }

      // Smooth lag interpolation between current position and physical swings coordinate
      state.x += (idealX - state.x) * 0.08;
      state.y += (idealY - state.y) * 0.08;

      // 2. Clear draw area
      ctx.clearRect(0, 0, width, height);

      // Flash effect if selfie active
      if (state.selfieActive && state.selfieFlash > 0.05) {
        ctx.fillStyle = `rgba(255, 255, 255, ${state.selfieFlash * 0.9})`;
        ctx.fillRect(0, 0, width, height);
      }

      const colors = getSuitColors();

      // 3. Render Support / Structures: Rope Web Line (with beautiful elasticity ripples)
      ctx.save();
      ctx.strokeStyle = '#FAF6F0';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.45)';
      ctx.shadowBlur = 8;
      ctx.globalAlpha = config.opacity * 0.8;

      ctx.beginPath();
      ctx.moveTo(state.ropeAnchorX, state.ropeAnchorY);

      // Elastic bending simulation
      const midX = (state.ropeAnchorX + state.x) / 2;
      const midY = (state.ropeAnchorY + state.y) / 2;
      const flexX = midX + Math.sin(state.poseTime * 0.06) * 15; // wind reaction
      ctx.quadraticCurveTo(flexX, midY, state.x, state.y);
      ctx.stroke();
      ctx.restore();

      // 4. Draw Active Dynamic Web Shot (when user clicks)
      if (state.webShooting) {
        ctx.save();
        ctx.strokeStyle = config.webColor || '#FFFFFF';
        ctx.lineWidth = 2.2 * state.webStrength;
        ctx.shadowColor = config.webColor || '#FFFFFF';
        ctx.shadowBlur = 10;
        ctx.globalAlpha = state.webStrength * 0.95;

        // Draw multiple glowing lines for spider web effect
        ctx.beginPath();
        ctx.moveTo(state.x, state.y - 10);
        ctx.lineTo(state.webTargetX, state.webTargetY);
        ctx.stroke();

        // mini circular shock ripples from web launch
        for (let r = 1; r <= 3; r++) {
          ctx.beginPath();
          ctx.arc(state.x, state.y - 10, r * 15 * (1 - state.webStrength), 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 5. Render Spider-Man Figure
      ctx.save();
      ctx.translate(state.x, state.y);
      ctx.globalAlpha = config.opacity;

      // If flipping, add cumulative rotation
      if (state.flipActive) {
        ctx.rotate(state.flipProgress * Math.PI * 2);
      }

      // Subtle breeze swaying reaction
      ctx.rotate(Math.sin(state.poseTime * 0.035) * 0.04);

      // Determine active suit details draw
      const bodyScale = state.isMobile ? 0.72 : 1;
      ctx.scale(bodyScale, bodyScale);

      // Classic, glowing_sakura or Miles Morales rendering
      if (active === 'contact') {
        // RENDER UPSIDE DOWN HANGING POSE
        ctx.save();
        ctx.scale(1, -1); // Flip vertically for hanging upside down
        drawUpsideDownSpidey(ctx, colors, state);
        ctx.restore();
      } else if (active === 'about') {
        // WALL CLIMBING / LOOKING TO THE RIGHT POSE
        drawClimbingSpidey(ctx, colors, state);
      } else if (active === 'skills') {
        // LEAPING / SHOOTING WEB DOWNWARD POSE
        drawLeapingSpidey(ctx, colors, state);
      } else {
        // STANDARD SWINGING / SAVIOR POSE
        drawSwingingSpidey(ctx, colors, state);
      }

      ctx.restore();

      // Draw interactive indicator near Spiderman to guide recruiters to click him
      ctx.save();
      ctx.fillStyle = '#FAF6F0';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.globalAlpha = 0.35 + Math.sin(state.poseTime * 0.05) * 0.15;
      ctx.fillText('[ CLICK ME FOR EASTER EGGS ]', state.x, state.y + 65);
      ctx.restore();

      animId = requestAnimationFrame(run);
    };

    // POSE RENDERING FUNCTIONS:
    // Drawing sub-methods using solid Canvas math vector polygons

    // A. STANDARD SWINGING POSE
    const drawSwingingSpidey = (
      c: CanvasRenderingContext2D,
      colors: any,
      st: any
    ) => {
      // Draw Head
      c.fillStyle = colors.primary;
      c.beginPath();
      c.arc(0, -25, 14, 0, Math.PI * 2);
      c.fill();

      // Head shape details and jawlines
      c.beginPath();
      c.ellipse(0, -23, 14, 16, 0, 0, Math.PI * 2);
      c.fill();

      // Eyes (glowing white, with dark border)
      drawEyes(c, 0, -25, colors, st);

      // Torso / Chest with Spider symbol
      c.fillStyle = colors.secondary;
      c.beginPath();
      c.moveTo(-10, -10);
      c.lineTo(10, -10);
      c.lineTo(8, 20);
      c.lineTo(-8, 20);
      c.closePath();
      c.fill();

      // Red central armor panel
      c.fillStyle = colors.primary;
      c.beginPath();
      c.moveTo(-6, -10);
      c.lineTo(6, -10);
      c.lineTo(4, 20);
      c.lineTo(-4, 20);
      c.closePath();
      c.fill();

      // Web vector lines overlaying suit
      drawSuitWebbing(c);

      // Spider insignia
      c.fillStyle = colors.spider;
      c.beginPath();
      c.moveTo(0, 0);
      // center hourglass
      c.lineTo(2, -3); c.lineTo(4, -3); c.lineTo(1, 1); c.lineTo(3, 5); c.lineTo(0, 7);
      c.lineTo(-3, 5); c.lineTo(-1, 1); c.lineTo(-4, -3); c.lineTo(-2, -3);
      c.closePath();
      c.fill();

      // insig legs
      c.strokeStyle = colors.spider;
      c.lineWidth = 1;
      [-1, 1].forEach((dir) => {
        c.beginPath();
        c.moveTo(dir * 1, 0);
        c.quadraticCurveTo(dir * 8, -6, dir * 10, -8);
        c.stroke();
        c.beginPath();
        c.moveTo(dir * 1, 2);
        c.quadraticCurveTo(dir * 10, 2, dir * 12, 5);
        c.stroke();
      });

      // Swinging arms
      // Left arm holding onto rope web (reaches up-left)
      c.strokeStyle = colors.primary;
      c.lineWidth = 6;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(-8, -8);
      c.lineTo(-22, -32);
      c.stroke();

      // Right arm: pointing forward, or waving hand on greeting
      c.beginPath();
      c.moveTo(8, -8);
      if (st.greetingActive) {
        // waving hand dynamically
        const waveAngle = Math.sin(st.poseTime * 0.28) * 15;
        c.lineTo(20, -20);
        c.lineTo(25 + waveAngle, -32);
      } else {
        // standard pointing pose toward View Projects CTA
        c.lineTo(18, -2);
        c.lineTo(30, -5);
      }
      c.stroke();

      // Legs in athletic swing positions
      // Left Leg tucked
      c.strokeStyle = colors.secondary;
      c.lineWidth = 7;
      c.beginPath();
      c.moveTo(-6, 18);
      c.lineTo(-15, 32);
      c.lineTo(-8, 48);
      c.stroke();

      // Right leg extended
      c.beginPath();
      c.moveTo(6, 18);
      c.lineTo(14, 30);
      c.lineTo(24, 46);
      c.stroke();

      // Boot details
      c.strokeStyle = colors.primary;
      c.lineWidth = 7.5;
      c.beginPath();
      c.moveTo(-15, 32); c.lineTo(-8, 48);
      c.stroke();
      c.beginPath();
      c.moveTo(14, 30); c.lineTo(24, 46);
      c.stroke();
    };

    // B. UPSIDE DOWN HANGING POSE (Hangs by feet)
    const drawUpsideDownSpidey = (
      c: CanvasRenderingContext2D,
      colors: any,
      st: any
    ) => {
      // Let's hang elegantly!
      // Draw Head
      c.fillStyle = colors.primary;
      c.beginPath();
      c.ellipse(0, 18, 12, 14, 0, 0, Math.PI * 2);
      c.fill();
      drawEyes(c, 0, 18, colors, st);

      // Torso
      c.fillStyle = colors.secondary;
      c.beginPath();
      c.moveTo(-9, 10);
      c.lineTo(9, 10);
      c.lineTo(6, -18);
      c.lineTo(-6, -18);
      c.closePath();
      c.fill();

      // Core chest panel red
      c.fillStyle = colors.primary;
      c.beginPath();
      c.moveTo(-6, 10);
      c.lineTo(6, 10);
      c.lineTo(3, -18);
      c.lineTo(-3, -18);
      c.closePath();
      c.fill();

      drawSuitWebbing(c);

      // Inverted Insignia
      c.fillStyle = colors.spider;
      c.beginPath();
      c.arc(0, -2, 2.5, 0, Math.PI * 2);
      c.fill();

      // Arms crossed, or waving with Peace Sign pose
      c.strokeStyle = colors.primary;
      c.lineWidth = 5.5;
      c.lineCap = 'round';

      if (st.greetingActive) {
        // Wave upside-down
        c.beginPath();
        c.moveTo(-7, 2);
        c.lineTo(-16, 18);
        c.lineTo(-18, 30);
        c.stroke();
      } else {
        // Crossed comfort pose
        c.beginPath();
        c.moveTo(-8, 2);
        c.lineTo(-14, 10);
        c.lineTo(0, 12);
        c.stroke();
      }

      // Other arm holding phone / posing for selfie!
      c.beginPath();
      c.moveTo(8, 2);
      if (st.selfieActive) {
        c.lineTo(24, 4);
        c.lineTo(28, -8); // pointing virtual phone at screen
      } else {
        c.lineTo(14, 10);
        c.lineTo(0, 12);
      }
      c.stroke();

      // Draw phone if selfie is active
      if (st.selfieActive) {
        c.fillStyle = '#1A1A1A';
        c.strokeStyle = '#D4AF37';
        c.lineWidth = 1;
        c.fillRect(23, -15, 10, 15);
        c.strokeRect(23, -15, 10, 15);
        c.fillStyle = '#37E6FF'; // screen
        c.fillRect(24, -13, 8, 11);
      }

      // Legs bent in secure triangular string pose holding rope
      c.strokeStyle = colors.secondary;
      c.lineWidth = 6;
      c.beginPath();
      c.moveTo(-6, -16);
      c.lineTo(-18, -32);
      c.lineTo(-2, -44); // boots connect near top
      c.stroke();

      c.beginPath();
      c.moveTo(6, -16);
      c.lineTo(18, -32);
      c.lineTo(2, -44);
      c.stroke();

      // Red boots details at attachment point
      c.strokeStyle = colors.primary;
      c.lineWidth = 6.5;
      c.beginPath();
      c.moveTo(-18, -32); c.lineTo(-2, -44);
      c.stroke();
      c.beginPath();
      c.moveTo(18, -32); c.lineTo(2, -44);
      c.stroke();
    };

    // C. CLIMBING POSE
    const drawClimbingSpidey = (
      c: CanvasRenderingContext2D,
      colors: any,
      st: any
    ) => {
      // Draw Head turned slightly to side
      c.fillStyle = colors.primary;
      c.beginPath();
      c.ellipse(0, -22, 11, 14, 0.15, 0, Math.PI * 2);
      c.fill();
      drawEyes(c, 0, -22, colors, st);

      // Torso
      c.fillStyle = colors.secondary;
      c.beginPath();
      c.moveTo(-9, -10);
      c.lineTo(9, -10);
      c.lineTo(5, 14);
      c.lineTo(-5, 14);
      c.closePath();
      c.fill();

      // Chest panel
      c.fillStyle = colors.primary;
      c.beginPath();
      c.moveTo(-5, -10);
      c.lineTo(5, -10);
      c.lineTo(2, 14);
      c.lineTo(-2, 14);
      c.closePath();
      c.fill();

      drawSuitWebbing(c);

      // Spider logo
      c.fillStyle = colors.spider;
      c.beginPath();
      c.arc(0, -2, 2, 0, Math.PI * 2);
      c.fill();

      // Arms: grabbing wall
      c.strokeStyle = colors.primary;
      c.lineWidth = 5;
      c.lineCap = 'round';
      
      // Left arm high wall grasp
      c.beginPath();
      c.moveTo(-8, -8);
      c.lineTo(-24, -22);
      c.lineTo(-18, -34);
      c.stroke();

      // Right arm low wall rest
      c.beginPath();
      c.moveTo(8, -8);
      c.lineTo(20, -14);
      c.lineTo(24, 2);
      c.stroke();

      // Legs: spider-climb sprawl
      c.strokeStyle = colors.secondary;
      c.lineWidth = 6;
      
      // Left leg bent sprawl
      c.beginPath();
      c.moveTo(-5, 12);
      c.lineTo(-18, 18);
      c.lineTo(-14, 34);
      c.stroke();

      // Right leg high crawl hold
      c.beginPath();
      c.moveTo(5, 12);
      c.lineTo(16, 22);
      c.lineTo(22, 14);
      c.stroke();
    };

    // D. LEAPING / SKILLS CARD SHOOTER POSE
    const drawLeapingSpidey = (
      c: CanvasRenderingContext2D,
      colors: any,
      st: any
    ) => {
      // Action dynamic frame!
      // Head looking straight down
      c.fillStyle = colors.primary;
      c.beginPath();
      c.ellipse(0, -18, 13, 13, 0, 0, Math.PI * 2);
      c.fill();
      drawEyes(c, 0, -18, colors, st);

      // Torso arched
      c.fillStyle = colors.secondary;
      c.beginPath();
      c.moveTo(-11, -8);
      c.lineTo(11, -8);
      c.lineTo(6, 16);
      c.lineTo(-6, 16);
      c.closePath();
      c.fill();

      c.fillStyle = colors.primary;
      c.beginPath();
      c.moveTo(-7, -8);
      c.lineTo(7, -8);
      c.lineTo(3, 16);
      c.lineTo(-3, 16);
      c.closePath();
      c.fill();

      drawSuitWebbing(c);

      // Insignia
      c.fillStyle = colors.spider;
      c.beginPath();
      c.arc(0, 1, 2, 0, Math.PI * 2);
      c.fill();

      // Arms: shooting webs sideways left-right
      c.strokeStyle = colors.primary;
      c.lineWidth = 5.5;
      c.lineCap = 'round';

      // Left arm fires web downward
      c.beginPath();
      c.moveTo(-8, -6);
      c.lineTo(-24, 2);
      c.lineTo(-35, 10);
      c.stroke();

      // Right arm firing web upward
      c.beginPath();
      c.moveTo(8, -6);
      c.lineTo(26, -14);
      c.lineTo(38, -22);
      c.stroke();

      // Legs tucked wide in high-jump gymnast pose
      c.strokeStyle = colors.secondary;
      c.lineWidth = 6;
      
      c.beginPath();
      c.moveTo(-5, 14);
      c.lineTo(-18, 22);
      c.lineTo(-28, 15);
      c.stroke();

      c.beginPath();
      c.moveTo(5, 14);
      c.lineTo(18, 22);
      c.lineTo(28, 15);
      c.stroke();
    };

    // Shared sub-draw method: WEB MESH SYSTERM
    const drawSuitWebbing = (c: CanvasRenderingContext2D) => {
      c.save();
      c.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      c.lineWidth = 0.55;
      // Draw gridlines
      for (let i = -10; i <= 10; i += 5) {
        c.beginPath();
        c.moveTo(i, -10);
        c.lineTo(i * 0.7, 20);
        c.stroke();
      }
      c.restore();
    };

    // Shared sub-draw method: DYNAMIC WHITE GLOWING SPIDER EYES
    const drawEyes = (
      c: CanvasRenderingContext2D,
      offsetX: number,
      offsetY: number,
      colors: any,
      st: any
    ) => {
      c.save();
      
      const widthFactor = 4;
      const heightFactor = 6;

      // Draw left eye base (thick black background contour)
      c.strokeStyle = '#000000';
      c.lineWidth = 2.2;
      c.fillStyle = colors.eyes || '#FFFFFF';

      [-1, 1].forEach((eyeSide) => {
        c.save();
        c.translate(offsetX + eyeSide * 5, offsetY + 1);
        c.rotate(eyeSide * 0.2); // angled look

        c.beginPath();
        c.moveTo(-widthFactor, 0);
        c.quadraticCurveTo(0, -heightFactor * st.eyesNarrow, widthFactor, -heightFactor * st.eyesNarrow);
        c.quadraticCurveTo(widthFactor + 1, 2, 0, heightFactor * 0.7);
        c.quadraticCurveTo(-widthFactor - 1, 1, -widthFactor, 0);
        c.closePath();
        c.stroke();
        c.fill();
        c.restore();
      });

      c.restore();
    };

    run();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseClick);
      cancelAnimationFrame(animId);
    };
  }, [config, activeSection]);

  if (!config.isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      id="spiderman-canvas"
      className="fixed inset-0 pointer-events-auto z-10"
      style={{
        mixBlendMode: 'screen',
        cursor: 'crosshair',
        pointerEvents: 'none' // We override click on canvas manually by viewport bindings
      }}
    />
  );
}
