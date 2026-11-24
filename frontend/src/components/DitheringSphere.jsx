import { useEffect, useRef } from "react";

export default function DitheringSphere() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let phase = 0;
    let width = 1;
    let height = 1;
    let dpr = 1;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, Math.floor(window.innerWidth * dpr));
      height = Math.max(1, Math.floor(window.innerHeight * dpr));
      canvas.width = width;
      canvas.height = height;
    };

    const draw = () => {
      if (!reduceMotion) phase += 0.006;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#fffaf6";
      ctx.fillRect(0, 0, width, height);

      const cx = width * 0.36 + Math.sin(phase * 0.7) * width * 0.008;
      const cy = height * 0.51;
      const radius = Math.min(height * 0.30, width * 0.225);
      const cell = Math.max(4, Math.floor(Math.min(width, height) / 150));
      const lightX = Math.cos(phase * 1.1) * 0.42;
      const lightY = Math.sin(phase * 0.8) * 0.34;
      const lightZ = 1.12;
      const lightLen = Math.hypot(lightX, lightY, lightZ);

      // Keep the sphere silhouette fixed and rotate its surface texture like a globe.
      const longitude = phase * 0.72;

      // Soft ambient shadow keeps the sphere visually separate from the page.
      const shadow = ctx.createRadialGradient(cx, cy + radius * 0.18, radius * 0.35, cx, cy + radius * 0.18, radius * 1.2);
      shadow.addColorStop(0, "rgba(123, 92, 180, 0.18)");
      shadow.addColorStop(1, "rgba(123, 92, 180, 0)");
      ctx.fillStyle = shadow;
      ctx.fillRect(0, 0, width, height);

      const left = Math.max(0, Math.floor(cx - radius));
      const right = Math.min(width, Math.ceil(cx + radius));
      const top = Math.max(0, Math.floor(cy - radius));
      const bottom = Math.min(height, Math.ceil(cy + radius));

      for (let y = top; y < bottom; y += cell) {
        const ny = (y - cy) / radius;
        for (let x = left; x < right; x += cell) {
          const nx = (x - cx) / radius;
          const dist = nx * nx + ny * ny;
          if (dist > 1) continue;
          const nz = Math.sqrt(1 - dist);
          const surfaceX = nx * Math.cos(longitude) + nz * Math.sin(longitude);
          const surfaceZ = nz * Math.cos(longitude) - nx * Math.sin(longitude);
          const diffuse = Math.max(0, (surfaceX * lightX + ny * lightY + surfaceZ * lightZ) / lightLen);
          const rim = Math.pow(1 - nz, 2.2) * 0.28;
          const wave = Math.sin(surfaceX * 17) * Math.cos(ny * 15 - phase * 0.25) * 0.055;
          const meridian = Math.pow(Math.abs(Math.sin(Math.atan2(surfaceX, surfaceZ) * 8)), 18) * 0.13;
          const value = diffuse * 0.82 + rim + wave + meridian;
          const threshold = ((Math.floor(x / cell) + Math.floor(y / cell)) % 2) ? 0.31 : 0.45;

          if (value > threshold) {
            const t = Math.min(1, Math.max(0, value));
            // Shift the sphere's actual pigment over time (not the page/background).
            const hue = (258 + phase * 24 + t * 22) % 360;
            const lightness = 58 + t * 13;
            ctx.fillStyle = `hsla(${hue}, 78%, ${lightness}%, ${0.58 + t * 0.40})`;
          } else {
            const shadowHue = (258 + phase * 24) % 360;
            ctx.fillStyle = `hsla(${shadowHue}, 42%, 43%, 0.48)`;
          }
          ctx.fillRect(x, y, cell * 0.78, cell * 0.78);
        }
      }

      // Highlight on the upper-left gives the sphere a soft, polished finish.
      const highlight = ctx.createRadialGradient(cx - radius * 0.34, cy - radius * 0.38, 1, cx - radius * 0.2, cy - radius * 0.25, radius * 0.75);
      highlight.addColorStop(0, "rgba(255,255,255,0.34)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = highlight;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      ctx.restore();

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(document.documentElement);
    draw();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="dither-sphere-canvas dither-sphere-fullscreen" aria-label="Animated BYTE SQUAD sphere" />;
}
