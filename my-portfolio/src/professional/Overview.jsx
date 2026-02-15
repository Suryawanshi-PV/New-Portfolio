import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import ResumePDF from "../Assects/Resume.pdf";
import { useSound } from "../hooks/useSound";

/* ============================================================
   GLITCH TEXT HOOK
   ============================================================ */
function useGlitch(text, active = true) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (!active) { setDisplay(text); return; }
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*";
    let iteration = 0;
    const maxIter = text.length * 2;
    const interval = setInterval(() => {
      setDisplay(
        text.split("").map((c, i) =>
          i < iteration / 2 ? c : chars[Math.floor(Math.random() * chars.length)]
        ).join("")
      );
      iteration++;
      if (iteration >= maxIter) { clearInterval(interval); setDisplay(text); }
    }, 30);
    return () => clearInterval(interval);
  }, [text, active]);
  return display;
}

/* ============================================================
   SCANLINE OVERLAY (CSS-only full coverage)
   ============================================================ */
function Scanlines() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none",
      background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)",
    }} />
  );
}

/* ============================================================
   FLOATING PARTICLE GRID (subtle background)
   ============================================================ */
function ParticleGrid() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, particles = [];
    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
      }));
    };
    resize();
    window.addEventListener("resize", resize);
    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(125,249,255,0.25)";
        ctx.fill();
        // lines to nearby
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x, dy = p.y - p2.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(125,249,255,${0.08 * (1 - d / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, []);
  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0,
    }} />
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function Overview() {
  const navigate = useNavigate();
  const [glitchActive, setGlitchActive] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const { playGlitch, playHover, playClick, playAmbient } = useSound();
  const titleGlitch = useGlitch("Pavankumar Suryawanshi", glitchActive);

  // Enable audio on first user interaction
  useEffect(() => {
    const enableAudio = () => {
      if (!audioEnabled) {
        setAudioEnabled(true);
        setTimeout(() => {
          // playGlitch();
          playAmbient();
        }, 100);
      }
    };

    // Listen for any user interaction
    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('keydown', enableAudio, { once: true });
    document.addEventListener('touchstart', enableAudio, { once: true });

    return () => {
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('keydown', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
    };
  }, [audioEnabled, playGlitch, playAmbient]);

  // one-time glitch on mount
  useEffect(() => {
    const t = setTimeout(() => setGlitchActive(false), 2800);
    return () => clearTimeout(t);
  }, []);

  const techList = [
    { name: "React", icon: "⬡" },
    { name: "FastAPI", icon: "⚡" },
    { name: "GeoServer", icon: "🌐" },
    { name: "PostGIS", icon: "📍" },
    { name: "PostgreSQL", icon: "🗄" },
    { name: "AWS DevOps", icon: "☁" },
    { name: "ArcGIS Pro", icon: "🗺" },
    { name: "QGIS", icon: "🧭" },
    { name: "Experience Builder", icon: "🧩" },
    { name: "Google AI", icon: "🤖" },
    { name: "Potree Viewer", icon: "🌳" },
    { name: "ESRI Products", icon: "📊" },
  ];

  const projects = [
    {
      title: "Crime Dashboard",
      desc: "Interactive dashboard visualizing crime events across Nashik, Pune, and Mumbai with exact location mapping. Features real-time filtering of different crime types and geospatial analysis.",
      tags: ["React", "Mapbox"],
      status: "Live",
      link: "https://suryawanshi-pv.github.io/Crime-Dashboard/",
    },
    {
      title: "Smart Agriculture Platform",
      desc: "Comprehensive platform for large-scale farm management with integrated AI assistant. Features farm creation, harvest tracking, soil analysis, predictive insights, and automated report generation.",
      tags: ["React", "FastAPI", "GeoServer", "PostGIS", "Google AI"],
      status: "In Development",
      link: false,
    },
    {
      title: "TreeStock",
      desc: "Advanced platform for tree inventory management, carbon emission tracking, and 3D forest visualization using point cloud data. Enables comprehensive environmental monitoring and analysis.",
      tags: ["React", "FastAPI", "AWS", "PostGIS", "Potree Viewer"],
      status: "In Development",
      link: false,
    },
  ];

  const experience = [
    {
      title: "GIS Developer",
      org: "TreeStock, Sheffield UK (Remote)",
      year: "May 2025 – Present",
      text: "Core React development for geospatial applications. Integrating open-source tools like GeoServer for spatial data management. Working with AWS infrastructure, PostgreSQL, and PostGIS for scalable geospatial solutions.",
    },
    {
      title: "Junior GIS Developer",
      org: "RSI Softech Hyderabad (Client: GISTEC Dubai)",
      year: "Dec 2022 – Apr 2025",
      text: "Frontend development focused on ESRI products including Experience Builder and ArcGIS Pro. Built responsive web applications with React, worked with spatial visualization tools, and managed geospatial data workflows.",
    },
  ];

  return (
    <div style={styles.page}>
      <Scanlines />
      <ParticleGrid />

      {/* ————————— HERO ————————— */}
      <div style={styles.hero}>
        {/* corner brackets */}
        <div style={styles.cornerTL} /><div style={styles.cornerTR} />
        <div style={styles.cornerBL} /><div style={styles.cornerBR} />

        <div style={styles.heroInner}>
          <div style={styles.heroBadge}>
            <span style={styles.heroBadgeDot} />
            GIS & Full Stack Developer
          </div>
          <h1 style={styles.heroTitle}>{titleGlitch}</h1>
          <p style={styles.heroText}>
            Specialized in building geospatial solutions with React, FastAPI, GeoServer, and PostGIS.
            Expert in ESRI products, AWS DevOps, and creating scalable location-based platforms.
          </p>
          <div style={styles.heroBtns}>
            <button style={styles.btnPrimary} onClick={() => {
              playClick();
              navigate("/professional/projects");
            }}>
              <span style={styles.btnPrimaryInner}>View Portfolio</span>
            </button>
            <a href={ResumePDF} download onClick={playClick} style={styles.btnGlass}>
              <span style={styles.btnGlassInner}>↓ Resume</span>
            </a>
          </div>
        </div>
      </div>

      {/* ————————— TECH STACK ————————— */}
      <div style={styles.section}>
        <div style={styles.sectionHead}>
          <span style={styles.sectionLabel}>[01]</span>
          <h2 style={styles.sectionTitle}>Core Technologies</h2>
        </div>
        <p style={styles.sectionSubtitle}>Specialized stack for high-performance geospatial applications.</p>
        <div style={styles.techGrid}>
          {techList.map((t) => (
            <TechCard key={t.name} icon={t.icon} name={t.name} playHover={playHover} />
          ))}
        </div>
      </div>

      {/* ————————— PROJECTS ————————— */}
      <div style={styles.section}>
        <div style={styles.sectionHead}>
          <span style={styles.sectionLabel}>[02]</span>
          <h2 style={styles.sectionTitle}>Featured Projects</h2>
        </div>
        <p style={styles.sectionSubtitle}>Production-grade applications solving real-world spatial problems.</p>
        <div style={styles.projectGrid}>
          {projects.map((p, i) => (
            <ProjectCard key={i} project={p} playHover={playHover} playClick={playClick} />
          ))}
        </div>
      </div>

      {/* ————————— EXPERIENCE ————————— */}
      <div style={styles.section}>
        <div style={styles.sectionHead}>
          <span style={styles.sectionLabel}>[03]</span>
          <h2 style={styles.sectionTitle}>Experience Snapshot</h2>
        </div>
        <div style={styles.timeline}>
          {experience.map((item, i) => (
            <div key={i} style={styles.timelineItem}>
              <div style={styles.dot} />
              <div style={styles.timelineLine} />
              <div style={styles.timelineContent}>
                <div style={styles.timelineHeader}>
                  <span style={styles.timelineTitle}>{item.title}</span>
                  <span style={styles.timelineOrg}>{item.org}</span>
                </div>
                <div style={styles.timelineDate}>{item.year}</div>
                <p style={styles.timelineText}>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TECH CARD (interactive hover)
   ============================================================ */
function TechCard({ icon, name, playHover }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => {
        setHover(true);
        playHover?.();
      }}
      onMouseLeave={() => setHover(false)}
      style={{
        ...styles.techCard,
        borderColor: hover ? "rgba(125,249,255,0.55)" : "rgba(125,249,255,0.12)",
        background: hover ? "rgba(125,249,255,0.1)" : "rgba(125,249,255,0.04)",
        transform: hover ? "translateY(-3px)" : "none",
        boxShadow: hover
          ? "0 8px 28px rgba(125,249,255,0.18), inset 0 1px 0 rgba(125,249,255,0.15)"
          : "0 2px 8px rgba(125,249,255,0.05)",
      }}
    >
      <div style={styles.techIcon}>{icon}</div>
      <div style={{ ...styles.techName, color: hover ? "#7df9ff" : "#c8e8ec" }}>{name}</div>
    </div>
  );
}

/* ============================================================
   PROJECT CARD
   ============================================================ */
function ProjectCard({ project, playHover, playClick }) {
  const [hover, setHover] = useState(false);
  const isLive = project.status === "Live";
  return (
    <div
      onMouseEnter={() => {
        setHover(true);
        playHover?.();
      }}
      onMouseLeave={() => setHover(false)}
      style={{
        ...styles.projectCard,
        borderColor: hover ? "rgba(125,249,255,0.35)" : "rgba(125,249,255,0.1)",
        transform: hover ? "translateY(-4px)" : "none",
        boxShadow: hover
          ? "0 16px 48px rgba(125,249,255,0.15), inset 0 1px 0 rgba(125,249,255,0.1)"
          : "0 4px 20px rgba(125,249,255,0.06)",
      }}
    >
      {/* top accent bar */}
      <div style={{
        ...styles.projectAccent,
        width: hover ? "100%" : "40%",
      }} />

      {/* image placeholder */}
      <div style={styles.projectImageBox}>
        <div style={styles.projectImageOverlay} />
        <span style={styles.projectImageText}>[ {project.title.toUpperCase()} ]</span>
      </div>

      {/* status badge */}
      <div style={styles.projectStatusRow}>
        <span style={{
          ...styles.statusBadge,
          background: isLive ? "rgba(74,222,128,0.15)" : "rgba(250,204,21,0.12)",
          borderColor: isLive ? "rgba(74,222,128,0.4)" : "rgba(250,204,21,0.35)",
          color: isLive ? "#4ade80" : "#facc15",
          boxShadow: isLive ? "0 0 8px rgba(74,222,128,0.25)" : "0 0 8px rgba(250,204,21,0.2)",
        }}>
          <span style={{
            ...styles.statusDot,
            background: isLive ? "#4ade80" : "#facc15",
            boxShadow: isLive ? "0 0 6px #4ade80" : "0 0 6px #facc15",
          }} />
          {project.status}
        </span>
      </div>

      <h3 style={styles.projectTitle}>{project.title}</h3>
      <p style={styles.projectDesc}>{project.desc}</p>

      {/* tags */}
      <div style={styles.tagRow}>
        {project.tags.map((tag) => (
          <span key={tag} style={styles.tag}>{tag}</span>
        ))}
      </div>

      {/* CTA */}
      <div style={styles.projectCTA}>
        {project.link ? (
          <a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ textDecoration: "none" }}
            onClick={(e) => {
              playClick();
            }}>
            <button 
              style={{
                ...styles.btnGhostSmall,
                borderColor: hover ? "rgba(125,249,255,0.6)" : "rgba(125,249,255,0.3)",
                color: hover ? "#7df9ff" : "rgba(125,249,255,0.7)",
                boxShadow: hover ? "0 0 12px rgba(125,249,255,0.2), 0 0 20px rgba(125,249,255,0.15)" : "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                pointerEvents: "none"
              }}>
              View Live Project →
            </button>
          </a>
        ) : (
          <span style={styles.btnDisabled}>Coming Soon</span>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   STYLES — kept page shell intact (90% height, overflowY auto)
   ============================================================ */
const styles = {
  /* --------- PAGE (UNTOUCHED core shell) --------- */
  page: {
    backgroundColor: "#0b0f1a",
    color: "#ffffff",
    height: "90%",
    padding: "10px",
    overflowY: "auto",
    fontFamily: "'Share Tech Mono', 'Courier New', monospace",
    background: "linear-gradient(135deg, #0b0f1a 0%, #0f1420 50%, #0b0f1a 100%)",
    position: "relative",
    zIndex: 1,
  },

  /* --------- HERO --------- */
  hero: {
    marginBottom: 80,
    maxWidth: "100%",
    padding: "clamp(32px, 6vw, 64px) clamp(20px, 5%, 48px)",
    background: "linear-gradient(135deg, rgba(11,15,26,0.97), rgba(15,20,32,0.97))",
    borderRadius: 16,
    position: "relative",
    overflow: "hidden",
    border: "1px solid rgba(125,249,255,0.12)",
    boxShadow: "0 20px 60px rgba(125,249,255,0.08), inset 0 1px 0 rgba(125,249,255,0.08)",
  },
  heroInner: { position: "relative", zIndex: 2 },

  /* corner brackets */
  cornerTL: { position: "absolute", top: 12, left: 12, width: 28, height: 28, borderTop: "2px solid rgba(125,249,255,0.45)", borderLeft: "2px solid rgba(125,249,255,0.45)", borderRadius: "4px 0 0 0", zIndex: 1 },
  cornerTR: { position: "absolute", top: 12, right: 12, width: 28, height: 28, borderTop: "2px solid rgba(125,249,255,0.45)", borderRight: "2px solid rgba(125,249,255,0.45)", borderRadius: "0 4px 0 0", zIndex: 1 },
  cornerBL: { position: "absolute", bottom: 12, left: 12, width: 28, height: 28, borderBottom: "2px solid rgba(125,249,255,0.45)", borderLeft: "2px solid rgba(125,249,255,0.45)", borderRadius: "0 0 0 4px", zIndex: 1 },
  cornerBR: { position: "absolute", bottom: 12, right: 12, width: 28, height: 28, borderBottom: "2px solid rgba(125,249,255,0.45)", borderRight: "2px solid rgba(125,249,255,0.45)", borderRadius: "0 0 4px 0", zIndex: 1 },

  heroBadge: {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "6px 14px", borderRadius: 20,
    background: "rgba(125,249,255,0.08)", border: "1px solid rgba(125,249,255,0.2)",
    color: "#7df9ff", fontSize: 12, fontWeight: 600, letterSpacing: 1.2,
    textTransform: "uppercase", marginBottom: 20,
  },
  heroBadgeDot: {
    width: 7, height: 7, borderRadius: "50%", background: "#4ade80",
    boxShadow: "0 0 6px #4ade80",
    animation: "pulse 2s ease infinite",
  },

  heroTitle: {
    fontSize: "clamp(26px, 5.5vw, 46px)",
    fontWeight: 800, lineHeight: 1.15, marginBottom: 18,
    background: "linear-gradient(135deg, #ffffff 0%, #7df9ff 60%, #a78bfa 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
    letterSpacing: "-0.5px",
  },
  heroText: {
    opacity: 0.9, lineHeight: 1.8, marginBottom: 32,
    fontSize: "clamp(13px, 1.8vw, 15px)", maxWidth: 580, color: "#ffffff",
  },
  heroBtns: {
    display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center",
  },

  /* --------- BUTTONS --------- */
  btnPrimary: {
    background: "linear-gradient(135deg, #7df9ff, #5eead4)",
    color: "#0b0f1a", border: "none",
    padding: "clamp(10px, 2vw, 13px) clamp(20px, 4vw, 30px)",
    borderRadius: 8, fontWeight: 700, cursor: "pointer",
    fontSize: "clamp(13px, 1.8vw, 14px)", letterSpacing: 0.5,
    boxShadow: "0 4px 20px rgba(125,249,255,0.3)",
    transition: "all 0.25s ease", position: "relative", overflow: "hidden",
    fontFamily: "'Share Tech Mono', monospace",
  },
  btnPrimaryInner: { position: "relative", zIndex: 1 },

  btnGlass: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(125,249,255,0.3)",
    padding: "clamp(10px, 2vw, 13px) clamp(20px, 4vw, 30px)",
    borderRadius: 8, color: "#7df9ff", cursor: "pointer",
    fontSize: "clamp(13px, 1.8vw, 14px)", fontWeight: 600, letterSpacing: 0.5,
    backdropFilter: "blur(8px)", textDecoration: "none", display: "inline-flex",
    alignItems: "center", gap: 6, transition: "all 0.25s ease",
    fontFamily: "'Share Tech Mono', monospace",
  },
  btnGlassInner: { position: "relative", zIndex: 1 },

  /* --------- SECTIONS --------- */
  section: { marginBottom: 90, position: "relative", zIndex: 1 },
  sectionHead: { display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 },
  sectionLabel: {
    fontSize: 11, color: "rgba(125,249,255,0.5)", letterSpacing: 2, fontWeight: 600,
  },
  sectionTitle: {
    fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 700, color: "#e2e8f0",
  },
  sectionSubtitle: {
    opacity: 0.85, marginBottom: 28, fontSize: "clamp(12px, 1.6vw, 14px)", color: "#ffffff",
  },

  /* --------- TECH GRID --------- */
  techGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(clamp(120px, 22vw, 160px), 1fr))",
    gap: "clamp(10px, 2vw, 16px)",
  },
  techCard: {
    padding: "clamp(12px, 2vw, 18px) 10px", borderRadius: 10, textAlign: "center",
    border: "1px solid rgba(125,249,255,0.12)",
    background: "rgba(125,249,255,0.04)",
    transition: "all 0.25s ease", cursor: "pointer",
  },
  techIcon: { fontSize: 18, marginBottom: 6, opacity: 0.8 },
  techName: { fontSize: "clamp(11px, 1.5vw, 13px)", fontWeight: 600, letterSpacing: 0.3, transition: "color 0.25s" },

  /* --------- PROJECT GRID --------- */
  projectGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(clamp(260px, 30vw, 320px), 1fr))",
    gap: "clamp(16px, 3vw, 24px)",
  },
  projectCard: {
    padding: "clamp(16px, 3vw, 24px)", borderRadius: 14,
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(125,249,255,0.1)",
    transition: "all 0.3s ease", display: "flex", flexDirection: "column",
    position: "relative", overflow: "hidden",
  },
  projectAccent: {
    position: "absolute", top: 0, left: 0, height: 2,
    background: "linear-gradient(90deg, #7df9ff, transparent)",
    transition: "width 0.4s ease",
  },
  projectImageBox: {
    width: "100%", height: "clamp(100px, 18vw, 160px)", borderRadius: 10,
    background: "linear-gradient(135deg, rgba(125,249,255,0.06), rgba(20,28,45,0.6))",
    border: "1px solid rgba(125,249,255,0.1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative", overflow: "hidden", marginBottom: 14,
  },
  projectImageOverlay: {
    position: "absolute", inset: 0,
    background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(125,249,255,0.015) 3px, rgba(125,249,255,0.015) 4px)",
  },
  projectImageText: {
    fontSize: "clamp(10px, 1.8vw, 13px)", color: "rgba(125,249,255,0.35)",
    letterSpacing: 2, fontWeight: 600, position: "relative", zIndex: 1,
  },

  projectStatusRow: { marginBottom: 10 },
  statusBadge: {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "4px 10px", borderRadius: 12, border: "1px solid",
    fontSize: 11, fontWeight: 600, letterSpacing: 0.8,
  },
  statusDot: { width: 6, height: 6, borderRadius: "50%" },

  projectTitle: {
    fontSize: "clamp(15px, 2.4vw, 18px)", fontWeight: 700, color: "#e2e8f0", marginBottom: 8,
  },
  projectDesc: {
    fontSize: "clamp(12px, 1.6vw, 13.5px)", color: "#ffffff", lineHeight: 1.65,
    marginBottom: 14, flex: 1,
  },
  tagRow: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 },
  tag: {
    padding: "4px 10px", borderRadius: 6, fontSize: 10,
    background: "rgba(125,249,255,0.08)", border: "1px solid rgba(125,249,255,0.18)",
    color: "#7df9ff", fontWeight: 600, letterSpacing: 0.4,
  },
  projectCTA: { marginTop: "auto" },
  btnGhostSmall: {
    background: "transparent", border: "1px solid rgba(125,249,255,0.3)",
    color: "rgba(125,249,255,0.7)", padding: "8px 16px", borderRadius: 6,
    fontSize: "clamp(11px, 1.5vw, 13px)", cursor: "pointer",
    transition: "all 0.25s ease", fontFamily: "'Share Tech Mono', monospace",
    fontWeight: 600, letterSpacing: 0.3,
  },
  btnDisabled: {
    fontSize: 12, color: "rgba(255,255,255,0.25)", fontStyle: "italic", letterSpacing: 0.5,
  },

  /* --------- TIMELINE --------- */
  timeline: {
    borderLeft: "1px solid rgba(125,249,255,0.15)",
    paddingLeft: "clamp(20px, 4vw, 30px)",
    marginLeft: 6,
  },
  timelineItem: {
    position: "relative", marginBottom: 36, paddingBottom: 28,
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  dot: {
    width: 11, height: 11, background: "#7df9ff", borderRadius: "50%",
    position: "absolute", left: -27, top: 6,
    boxShadow: "0 0 8px rgba(125,249,255,0.5)",
  },
  timelineLine: {
    position: "absolute", left: -22, top: 17, width: 16, height: 1,
    background: "rgba(125,249,255,0.25)",
  },
  timelineContent: { position: "relative", zIndex: 1 },
  timelineHeader: {
    display: "flex", flexWrap: "wrap", gap: "6px 16px", alignItems: "baseline", marginBottom: 4,
  },
  timelineTitle: {
    fontSize: "clamp(14px, 2.2vw, 16px)", fontWeight: 700, color: "#7df9ff",
  },
  timelineOrg: {
    fontSize: "clamp(11px, 1.6vw, 13px)", color: "#ffffff", fontStyle: "italic",
  },
  timelineDate: {
    fontSize: 11, color: "rgba(125,249,255,0.4)", letterSpacing: 1, marginBottom: 8,
    textTransform: "uppercase",
  },
  timelineText: {
    color: "#ffffff", fontSize: "clamp(12px, 1.7vw, 13.5px)", lineHeight: 1.7,
  },
};

/* ============================================================
   INJECT KEYFRAMES (once)
   ============================================================ */
(function injectCSS() {
  if (document.getElementById("__overview_keyframes__")) return;
  const el = document.createElement("style");
  el.id = "__overview_keyframes__";
  el.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
  `;
  document.head.appendChild(el);
})();