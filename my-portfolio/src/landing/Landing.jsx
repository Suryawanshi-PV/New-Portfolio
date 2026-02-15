import { Box, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

/* ============================================================
   FONT INJECTION
   ============================================================ */
(function injectFonts() {
  if (document.getElementById("__landing_fonts__")) return;
  const el = document.createElement("link");
  el.id = "__landing_fonts__";
  el.rel = "stylesheet";
  el.href =
    "https://fonts.googleapis.com/css2?" +
    "family=Share+Tech+Mono&" +
    "family=Rajdhani:wght@300;400;500;600;700&" +
    "family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&" +
    "display=swap";
  document.head.appendChild(el);
})();

/* ============================================================
   KEYFRAMES
   ============================================================ */
(function injectCSS() {
  if (document.getElementById("__landing_keyframes__")) return;
  const el = document.createElement("style");
  el.id = "__landing_keyframes__";
  el.textContent = `
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%      { opacity: 0.4; transform: scale(0.82); }
    }
    @keyframes fadeInLeft {
      from { opacity: 0; transform: translateX(-22px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeInRight {
      from { opacity: 0; transform: translateX(22px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes scanlineDrift {
      0%   { background-position: 0 0; }
      100% { background-position: 0 4px; }
    }
    @keyframes grain {
      0%   { transform: translate(0,0); }
      33%  { transform: translate(-2%,-1%); }
      66%  { transform: translate(1%,2%); }
      100% { transform: translate(0,0); }
    }
    .entry-anim-left {
      animation: fadeInLeft 0.6s 0.15s cubic-bezier(.4,0,.2,1) both;
    }
    .entry-anim-right {
      animation: fadeInRight 0.6s 0.28s cubic-bezier(.4,0,.2,1) both;
    }
  `;
  document.head.appendChild(el);
})();

/* ============================================================
   PAGE THEMES — only controls background, particles, heading accent.
   The name gradient is LOCKED and never changes (see below).
   ============================================================ */
const THEMES = {
  default: {
    bg: "#0c1014",
    bgGradient:
      "radial-gradient(ellipse at 50% -10%, #1a2520 0%, transparent 60%), " +
      "radial-gradient(ellipse at 80% 90%, #151c1a 0%, transparent 50%), " +
      "linear-gradient(180deg, #0c1014 0%, #0e1210 100%)",
    font: "'Playfair Display', serif",
    accentColor: "#c9a0b4",
    subText: "rgba(180,160,170,0.6)",
    particleColor: [190, 150, 170],
    particleCount: 38,
    particleOpacity: 0.22,
    scanlines: false,
    grain: false,
  },
  cyber: {
    bg: "#0a0e1a",
    bgGradient:
      "radial-gradient(ellipse at 25% 15%, #0d1b2a 0%, transparent 55%), " +
      "radial-gradient(ellipse at 78% 82%, #0f1f35 0%, transparent 50%), " +
      "linear-gradient(180deg, #0a0e1a 0%, #0b1220 100%)",
    font: "'Share Tech Mono', monospace",
    accentColor: "#7df9ff",
    subText: "rgba(125,249,255,0.5)",
    particleColor: [125, 249, 255],
    particleCount: 62,
    particleOpacity: 0.25,
    scanlines: true,
    grain: false,
  },
  void: {
    bg: "#0d0a14",
    bgGradient:
      "radial-gradient(ellipse at 58% 28%, #1a1428 0%, transparent 58%), " +
      "radial-gradient(ellipse at 18% 78%, #151020 0%, transparent 52%), " +
      "linear-gradient(180deg, #0d0a14 0%, #110e1c 100%)",
    font: "'Rajdhani', sans-serif",
    accentColor: "#f0a045",
    subText: "rgba(224,200,160,0.55)",
    particleColor: [240, 160, 69],
    particleCount: 40,
    particleOpacity: 0.2,
    scanlines: false,
    grain: true,
  },
};

/* ============================================================
   CARD THEMES — permanent, never swap
   ============================================================ */
const CARD_CYBER = {
  accent: "#7df9ff",
  cardBg: "rgba(125,249,255,0.06)",
  cardBorder: "rgba(125,249,255,0.28)",
  cardGlow: "0 12px 40px rgba(125,249,255,0.08)",
  cardGlowHover: "0 28px 72px rgba(125,249,255,0.22), 0 0 0 1px rgba(125,249,255,0.18)",
  textPrimary: "#dff0f5",
  textSub: "rgba(148,200,215,0.6)",
  font: "'Share Tech Mono', monospace",
};

const CARD_VOID = {
  accent: "#f0a045",
  cardBg: "rgba(240,160,69,0.06)",
  cardBorder: "rgba(240,160,69,0.28)",
  cardGlow: "0 12px 40px rgba(240,160,69,0.07)",
  cardGlowHover: "0 28px 72px rgba(240,160,69,0.2), 0 0 0 1px rgba(240,160,69,0.16)",
  textPrimary: "#e8ddd0",
  textSub: "rgba(200,180,140,0.6)",
  font: "'Rajdhani', sans-serif",
};


/* ============================================================
   PARTICLE CANVAS — mounted once, reads theme via ref
   ============================================================ */
function ParticleCanvas({ theme }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    particlesRef.current = Array.from({ length: themeRef.current.particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.3 + 0.5,
    }));

    const draw = () => {
      const t = themeRef.current;
      const cw = canvas.width, ch = canvas.height;
      const ctx = canvas.getContext("2d");
      const pts = particlesRef.current;
      const target = t.particleCount;

      while (pts.length < target) {
        pts.push({
          x: Math.random() * cw, y: Math.random() * ch,
          vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.3 + 0.5,
        });
      }
      if (pts.length > target) pts.length = target;

      ctx.clearRect(0, 0, cw, ch);
      const [r, g, b] = t.particleColor;
      const op = t.particleOpacity;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = cw; if (p.x > cw) p.x = 0;
        if (p.y < 0) p.y = ch; if (p.y > ch) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${op})`;
        ctx.fill();

        for (let j = i + 1; j < pts.length; j++) {
          const p2 = pts[j];
          const dx = p.x - p2.x, dy = p.y - p2.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 115) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${op * 0.28 * (1 - d / 115)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0,
    }} />
  );
}

/* ============================================================
   SCANLINES
   ============================================================ */
function Scanlines({ visible }) {
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
      background: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.035) 2px, rgba(0,0,0,0.035) 4px)",
      backgroundSize: "100% 4px",
      opacity: visible ? 0.6 : 0,
      transition: "opacity 0.5s ease",
      animation: "scanlineDrift 0.15s steps(1) infinite",
    }} />
  );
}

/* ============================================================
   GRAIN
   ============================================================ */
function Grain({ visible }) {
  return (
    <div style={{
      position: "absolute", inset: "-10%", pointerEvents: "none", zIndex: 1,
      opacity: visible ? 0.2 : 0,
      transition: "opacity 0.5s ease",
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: "200px 200px",
      animation: visible ? "grain 0.5s steps(2) infinite" : "none",
    }} />
  );
}

/* ============================================================
   GLITCH — once on mount only
   ============================================================ */
function useGlitch(text) {
  const [display, setDisplay] = useState(text);
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$&";
    let iter = 0;
    const max = Math.floor(text.length * 2.2);
    const id = setInterval(() => {
      setDisplay(
        text.split("").map((c, i) =>
          i < iter / 2 ? c : chars[Math.floor(Math.random() * chars.length)]
        ).join("")
      );
      iter++;
      if (iter >= max) { clearInterval(id); setDisplay(text); }
    }, 28);
    return () => clearInterval(id);
  }, []);
  return display;
}

/* ============================================================
   ENTRY CARD
   - cardTheme is permanent (never changes)
   - `shrink` prop controls whether this card should shrink
     when the OTHER card is hovered
   ============================================================ */
function EntryCard({ title, description, cardTheme, isCyber, onClick, animClass, shrink, isMobile }) {
  const [hover, setHover] = useState(false);
  const { accent, cardBg, cardBorder, cardGlow, cardGlowHover, textPrimary, textSub, font } = cardTheme;

  let translateY = 0;
  let opacity = 1;
  let zIndex = 1;

  if (hover) {
    translateY = -8;
    zIndex = 10;
  } else if (shrink) {
    opacity = 0.55;
    zIndex = 0;
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      className={animClass}
      style={{
        position: "relative",
        zIndex,
        borderRadius: 18,
        overflow: "hidden",
        cursor: "pointer",
        padding: isMobile ? "18px 14px" : "clamp(24px, 4vw, 34px) clamp(20px, 3vw, 30px)",
        background: hover ? cardBg : "rgba(255,255,255,0.03)",
        border: `1px solid ${hover ? cardBorder : "rgba(255,255,255,0.07)"}`,
        boxShadow: hover ? cardGlowHover : cardGlow,
        transform: isMobile ? "translateY(0)" : `translateY(${translateY}px)`,
        opacity,
        transition:
          "transform 0.4s cubic-bezier(.4,0,.2,1), " +
          "opacity 0.4s ease, " +
          "background 0.3s ease, " +
          "border-color 0.3s ease, " +
          "box-shadow 0.35s ease",
        minHeight: isMobile ? "auto" : 240,
      }}
    >
      {/* top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, height: 2,
        width: hover ? "100%" : "28%",
        background: `linear-gradient(90deg, ${accent}, transparent)`,
        transition: "width 0.4s ease",
      }} />

      {/* corner brackets */}
      {!isMobile && (
        <>
          <div style={{ position:"absolute", top:10, left:10, width:22, height:22, borderTop:`2px solid ${hover ? accent+"70" : accent+"22"}`, borderLeft:`2px solid ${hover ? accent+"70" : accent+"22"}`, borderRadius:"5px 0 0 0", transition:"border-color 0.3s ease", pointerEvents:"none" }} />
          <div style={{ position:"absolute", top:10, right:10, width:22, height:22, borderTop:`2px solid ${hover ? accent+"70" : accent+"22"}`, borderRight:`2px solid ${hover ? accent+"70" : accent+"22"}`, borderRadius:"0 5px 0 0", transition:"border-color 0.3s ease", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:10, left:10, width:22, height:22, borderBottom:`2px solid ${hover ? accent+"70" : accent+"22"}`, borderLeft:`2px solid ${hover ? accent+"70" : accent+"22"}`, borderRadius:"0 0 0 5px", transition:"border-color 0.3s ease", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:10, right:10, width:22, height:22, borderBottom:`2px solid ${hover ? accent+"70" : accent+"22"}`, borderRight:`2px solid ${hover ? accent+"70" : accent+"22"}`, borderRadius:"0 0 5px 0", transition:"border-color 0.3s ease", pointerEvents:"none" }} />
        </>
      )}

      {/* icon + label */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom: 14 }}>
        <div style={{
          width: isMobile ? 32 : 38,
          height: isMobile ? 32 : 38,
          borderRadius: 11,
          background: hover ? accent + "22" : accent + "0c",
          border: `1px solid ${hover ? accent + "45" : accent + "18"}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize: isMobile ? 16 : 18,
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}>
          {isCyber ? "⬡" : "◎"}
        </div>
        <span style={{
          fontSize: 10,
          letterSpacing: 2.4,
          textTransform:"uppercase",
          color: hover ? accent : accent + "55",
          fontFamily: font,
          fontWeight: 600,
          transition:"color 0.3s ease",
        }}>
          {isCyber ? "Professional" : "Personal"}
        </span>
      </div>

      {/* title */}
      <h3 style={{
        fontSize: isMobile ? "clamp(16px, 4vw, 18px)" : "clamp(20px, 3.4vw, 24px)",
        fontWeight: 700,
        color: hover ? "#fff" : textPrimary,
        fontFamily: font,
        marginBottom: 10,
        lineHeight: 1.3,
        transition: "color 0.3s ease",
      }}>
        {title}
      </h3>

      {/* description */}
      <p style={{
        fontSize: isMobile ? "clamp(12px, 2vw, 13px)" : "clamp(13px, 1.7vw, 14px)",
        color: hover ? textSub.replace("0.6", "0.75") : textSub,
        lineHeight: 1.75,
        fontFamily: font,
        flex: 1,
        marginBottom: 18,
        transition: "color 0.3s ease",
      }}>
        {description}
      </p>

      {/* CTA row */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{
          fontSize: "clamp(12px, 1.6vw, 13px)",
          fontWeight: 600,
          color: accent,
          fontFamily: font,
          letterSpacing: 0.5,
          transform: hover ? "translateX(6px)" : "translateX(0)",
          transition: "transform 0.3s ease",
          display:"inline-block",
        }}>
          Enter →
        </span>

        <div style={{
          display:"flex", alignItems:"center", gap:6,
          fontSize: 10, color: accent + "77",
          fontFamily: font, letterSpacing: 1, textTransform:"uppercase",
        }}>
          <span style={{
            width:6, height:6, borderRadius:"50%",
            background: accent, boxShadow:`0 0 6px ${accent}`,
            animation: "pulse-dot 2s ease infinite",
          }} />
          Live
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN LANDING
   ============================================================ */
export default function Landing() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null); // null | "cyber" | "void"
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const theme =
    hovered === "cyber" ? THEMES.cyber
    : hovered === "void" ? THEMES.void
    : THEMES.default;

  const glitchedName = useGlitch("Pavankumar Suryawanshi");

  return (
    <Box sx={{
      minHeight: "100vh",
      bgcolor: theme.bg,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      px: isMobile ? 3 : 2,
      py: isMobile ? 4 : 2,
      backgroundImage: theme.bgGradient,
      transition: "background-color 0.5s ease",
      position: "relative",
      overflow: "hidden",
    }}>
      <ParticleCanvas theme={theme} />
      <Scanlines visible={theme.scanlines} />
      <Grain visible={theme.grain} />

      <Box maxWidth="lg" width="100%" textAlign="center" sx={{ position:"relative", zIndex:2 }}>

        {/* ——— HEADING ——— */}
        <Typography
          variant="h3"
          fontWeight={600}
          gutterBottom
          style={{
            fontFamily: theme.font,
            transition: "font-family 0.45s ease",
            animation: "fadeUp 0.6s 0.05s cubic-bezier(.4,0,.2,1) both",
            fontSize: isMobile ? "clamp(18px, 6vw, 26px)" : "clamp(32px, 5vw, 42px)",
          }}
        >
          {/* "Welcome to" — plain white, shifts font with theme */}
          <span style={{ color: "#e8e8e8" }}>Welcome to </span>

          {/* NAME — gradient is LOCKED forever. Never transitions. Never disappears. */}
          <span style={{
            background: "linear-gradient(135deg, #ffffff 0%, #7df9ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "inline-block",
          }}>
            {glitchedName}
          </span>

          <span style={{ color: "#e8e8e8" }}>&apos;s</span>

          <br />

          {/* "Digital Space" — this one DOES shift color with theme */}
          <span style={{
            color: theme.accentColor,
            transition: "color 0.5s ease, text-shadow 0.5s ease",
            textShadow: `0 0 24px ${theme.accentColor}35`,
            display: "inline-block",
            marginTop: 4,
          }}>
            Digital Space
          </span>
        </Typography>

        {/* subtitle */}
        <Typography
          variant="body1"
          style={{
            opacity: 0.6,
            marginBottom: isMobile ? 32 : 52,
            fontFamily: theme.font,
            color: theme.subText,
            fontSize: "clamp(13px, 1.8vw, 15px)",
            letterSpacing: 0.4,
            transition: "color 0.4s ease, font-family 0.45s ease",
            animation: "fadeUp 0.6s 0.18s cubic-bezier(.4,0,.2,1) both",
          }}
        >
          Choose how you want to explore my world
        </Typography>

        {/* ——— CARDS ——— */}
        <Grid container spacing={isMobile ? 2 : 4} justifyContent="center" alignItems="stretch">
          <Grid item xs={12} sm={11} md={5} style={{ display:"flex", justifyContent:"center", minHeight: isMobile ? "auto" : "280px" }}>
            <div
              onMouseEnter={() => setHovered("cyber")}
              onMouseLeave={() => setHovered(null)}
              style={{ width:"100%", height: "100%" }}
            >
              <EntryCard
                title="I'm a Recruiter"
                description="Professional portfolio, skills, projects & work experience — built for the people who matter."
                cardTheme={CARD_CYBER}
                isCyber={true}
                animClass="entry-anim-left"
                shrink={hovered === "void"}
                onClick={() => navigate("/professional")}
                isMobile={isMobile}
              />
            </div>
          </Grid>

          <Grid item xs={12} sm={11} md={5} style={{ display:"flex", justifyContent:"center", minHeight: isMobile ? "auto" : "280px" }}>
            <div
              onMouseEnter={() => setHovered("void")}
              onMouseLeave={() => setHovered(null)}
              style={{ width:"100%", height: "100%" }}
            >
              <EntryCard
                title="I'm an Explorer"
                description="Blogs, fitness logs, gaming, ambient journeys & the quieter side of life."
                cardTheme={CARD_VOID}
                isCyber={false}
                animClass="entry-anim-right"
                shrink={hovered === "cyber"}
                onClick={() => navigate("/personal")}
                isMobile={isMobile}
              />
            </div>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}