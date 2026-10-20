import React, { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 45;
// Softer, more transparent purples that show elegantly on white
const COLORS = ['#7C3AED', '#A855F7', '#8B5CF6', '#5B21B6', '#C4B5FD'];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() { this.reset(true); }

      reset(init = false) {
        this.x     = randomBetween(0, canvas.width);
        this.y     = init ? randomBetween(0, canvas.height) : canvas.height + 10;
        this.size  = randomBetween(1, 2.5);
        this.speedX = randomBetween(-0.3, 0.3);
        this.speedY = randomBetween(-0.4, -0.15);
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha    = randomBetween(0.06, 0.22);   /* lighter on white bg */
        this.alphaDir = randomBetween(0.001, 0.004) * (Math.random() > 0.5 ? 1 : -1);
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha += this.alphaDir;
        if (this.alpha <= 0.02 || this.alpha >= 0.25) this.alphaDir *= -1;
        if (this.y < -10) this.reset();
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle   = this.color;
        ctx.shadowBlur  = 6;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const init = () => {
      resize();
      particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => { p.update(); p.draw(); });
      animId = requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="particles-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
