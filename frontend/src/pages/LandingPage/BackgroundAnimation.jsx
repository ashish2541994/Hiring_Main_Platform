import { useEffect, useRef } from "react";
import styles from "./BackgroundAnimation.module.css";

const BackgroundAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];
    const particleCount = 60;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.hue = Math.random() * 60 + 220; // Blue to purple range
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
        ctx.fill();

        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsla(${this.hue}, 70%, 60%, ${this.opacity * 0.3})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let mouseX = 0;
    let mouseY = 0;
    let time = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const drawGrid = () => {
      if (!ctx) return;
      ctx.strokeStyle = `hsla(220, 20%, 60%, 0.03)`;
      ctx.lineWidth = 1;

      const gridSize = 80;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const animate = () => {
      if (!ctx) return;
      time += 0.002;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw animated gradient orbs
      const orbCount = 3;
      for (let i = 0; i < orbCount; i++) {
        const orbX = canvas.width * (0.2 + 0.6 * Math.sin(time + i * 2.1));
        const orbY = canvas.height * (0.2 + 0.6 * Math.cos(time + i * 1.7));
        const orbRadius = 200 + 100 * Math.sin(time * 0.5 + i);

        const gradient = ctx.createRadialGradient(
          orbX,
          orbY,
          0,
          orbX,
          orbY,
          orbRadius,
        );
        const hue = 220 + i * 20;
        gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, 0.08)`);
        gradient.addColorStop(0.5, `hsla(${hue + 30}, 70%, 50%, 0.04)`);
        gradient.addColorStop(1, `hsla(${hue + 60}, 60%, 40%, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw subtle grid
      drawGrid();

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(220, 60%, 60%, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Mouse interaction - draw glow around cursor
      const mouseGradient = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        250,
      );
      mouseGradient.addColorStop(0, "hsla(230, 80%, 60%, 0.06)");
      mouseGradient.addColorStop(0.5, "hsla(260, 70%, 50%, 0.03)");
      mouseGradient.addColorStop(1, "hsla(260, 60%, 40%, 0)");
      ctx.fillStyle = mouseGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      particles = [];
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.gradientOverlay} />
      <div className={styles.noiseOverlay} />
    </>
  );
};

export default BackgroundAnimation;
