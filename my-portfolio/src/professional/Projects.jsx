import { useState, useEffect, useRef } from "react";
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
   SCANLINE OVERLAY
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
   FLOATING PARTICLE GRID
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
   MAIN PROJECTS COMPONENT
   ============================================================ */
export default function Projects() {
  const [glitchActive, setGlitchActive] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const { playGlitch, playHover, playClick, playAmbient } = useSound();
  const titleGlitch = useGlitch("Projects & Publications", glitchActive);

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

    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('keydown', enableAudio, { once: true });
    document.addEventListener('touchstart', enableAudio, { once: true });

    return () => {
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('keydown', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
    };
  }, [audioEnabled, playGlitch, playAmbient]);

  useEffect(() => {
    const t = setTimeout(() => setGlitchActive(false), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={styles.page}>
      <Scanlines />
      <ParticleGrid />

      {/* HERO HEADER */}
      <section style={styles.hero}>
        <div style={styles.cornerTL} />
        <div style={styles.cornerTR} />
        <div style={styles.cornerBL} />
        <div style={styles.cornerBR} />
        
        <h1 style={styles.heroTitle}>{titleGlitch}</h1>
        <p style={styles.heroSubtitle}>
          A curated collection of geospatial engineering, full-stack web
          development projects, and published research.
        </p>
      </section>

      <div style={styles.contentWrapper}>
        {/* PUBLICATIONS SECTION */}
        <Section 
          label="[01]"
          title="Publications & Research"
          subtitle="Peer-reviewed scientific contributions in geospatial sciences"
        >
          <ProjectGrid>
            <PublicationCard
              title="Geo-Spatial Modelling of Groundwater Potential Zones Using MIF Method and ROC Validation in Semi-Arid Pune Region"
              journal="ISPRS Annals of Photogrammetry, Remote Sensing and Spatial Information Sciences"
              year="2025"
              doi="10.5194/isprs-annals-X-5-W2-2025-293-2025"
              description="Developed geospatial models to identify groundwater potential zones using Multi-Influencing Factor (MIF) technique integrated with Remote Sensing and GIS tools."
              contribution="First Author - Led methodology development, spatial analysis, ROC validation achieving AUC of 0.709, and delineated groundwater potential zones in Pune district."
              keywords={["Groundwater", "GIS", "Multi-Influencing Factor", "ROC Curve", "Remote Sensing"]}
              link="https://isprs-annals.copernicus.org/articles/X-5-W2-2025/293/2025/"
            />
          </ProjectGrid>
        </Section>

        {/* GEOSPATIAL ENGINEERING SECTION */}
        <Section
          label="[02]"
          title="GeoSpatial Engineering"
          subtitle="High-performance mapping & processing pipelines"
        >
          <ProjectGrid>
            <ProjectCard
              title="3D LiDAR Point Cloud Viewer"
              status="Live"
              description="Client-side visualization of massive LiDAR datasets (LAS/LAZ) directly in the browser."
              solution="WebGL-based renderer with Potree integration and optimized point loading."
              outcome="Smooth visualization of 50M+ points at 60fps."
              tech={["WebGL", "Potree", "Three.js"]}
              link="https://test-bucket-sps-09.s3.eu-west-2.amazonaws.com/Potree-FIles/Bigcovert/index.html"
              playHover={playHover}
              playClick={playClick}
            />
          </ProjectGrid>
        </Section>

        {/* FEATURED PROJECTS SECTION */}
        <Section
          label="[03]"
          title="Featured Projects"
          subtitle="Live and in-development geospatial platforms"
        >
          <ProjectGrid>
            <ProjectCard
              title="Crime Dashboard"
              status="Live"
              description="Interactive dashboard visualizing crime events across Nashik, Pune, and Mumbai with exact location mapping."
              solution="Built interactive frontend with React and Mapbox GL JS for real-time spatial filtering of crime types and hotspot visualization."
              outcome="Enables law enforcement to identify crime patterns and allocate resources efficiently."
              tech={["React", "Mapbox", "GIS"]}
              link="https://suryawanshi-pv.github.io/Crime-Dashboard/"
              image="/Crime%20Dashboard.png"
              playHover={playHover}
              playClick={playClick}
            />

            <ProjectCard
              title="Smart Agriculture Platform"
              status="In Development"
              description="Comprehensive platform for large-scale farm management with integrated AI assistant for predictive insights."
              solution="Developing full-stack solution with React frontend, FastAPI backend, GeoServer integration, PostGIS database, and Google AI for farm analytics and reporting."
              outcome="Enables farmers to manage huge farms, track harvests, analyze soil conditions, and generate automated reports with AI-powered recommendations."
              tech={["React", "FastAPI", "GeoServer", "PostGIS", "Google AI"]}
              image="/Smart%20Agree.png"
              playHover={playHover}
              playClick={playClick}
            />

            <ProjectCard
              title="TreeStock"
              status="In Development"
              description="Advanced platform for tree inventory management, carbon emission tracking, and 3D forest visualization."
              solution="Building geospatial solution with React frontend, FastAPI backend, AWS infrastructure, and Potree Viewer for point cloud visualization."
              outcome="Enables comprehensive environmental monitoring, carbon credit tracking, and forest health assessment through 3D visualization."
              tech={["React", "FastAPI", "AWS", "PostGIS", "Potree Viewer"]}
              image="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80"
              playHover={playHover}
              playClick={playClick}
            />

            <ProjectCard
              title="Flood Insights"
              status="Blueprint"
              description="Modern platform for flood hazard visualization, analysis, simulation, and emergency safe route planning."
              solution="Designing comprehensive geospatial platform integrating multi-source datasets, real-time flood modeling, and interactive map-based decision support tools."
              outcome="Will help communities prepare, respond, and recover from flood events through reliable data visualization and scenario analysis."
              tech={["React", "FastAPI", "PostGIS", "Mapbox", "AWS"]}
              image="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=500&h=300&fit=crop"
              playHover={playHover}
              playClick={playClick}
            />
          </ProjectGrid>
        </Section>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION COMPONENT
   ============================================================ */
function Section({ label, title, subtitle, children }) {
  return (
    <section style={styles.section}>
      <div style={styles.sectionLabel}>{label}</div>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <p style={styles.sectionSubtitle}>{subtitle}</p>
      {children}
    </section>
  );
}

/* ============================================================
   PROJECT GRID COMPONENT
   ============================================================ */
function ProjectGrid({ children }) {
  return <div style={styles.grid}>{children}</div>;
}

/* ============================================================
   PROJECT CARD COMPONENT
   ============================================================ */
function ProjectCard({
  title,
  status,
  description,
  solution,
  outcome,
  tech,
  link,
  image,
  playHover,
  playClick,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const statusColor = status === "Live" ? "#10b981" : status === "In Development" ? "#f59e0b" : "#64748b";

  return (
    <div
      style={{
        ...styles.card,
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: isHovered ? `0 20px 40px rgba(125,249,255,0.15)` : `0 8px 16px rgba(0,0,0,0.3)`,
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        playHover?.();
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {image && (
        <div style={styles.cardImage}>
          <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={styles.cardImageOverlay} />
        </div>
      )}

      <div style={styles.cardContent}>
        <div style={styles.cardHeader}>
          <span style={{ ...styles.statusBadge, borderColor: statusColor, color: statusColor }}>
            ● {status}
          </span>
        </div>

        <h3 style={styles.cardTitle}>{title}</h3>

        <p style={styles.cardText}>
          <span style={styles.label}>Overview:</span> {description}
        </p>
        <p style={styles.cardText}>
          <span style={styles.label}>My Role:</span> {solution}
        </p>
        <p style={styles.cardText}>
          <span style={styles.label}>Impact:</span> {outcome}
        </p>

        <div style={styles.techRow}>
          {tech.map((t) => (
            <span key={t} style={styles.techChip}>
              {t}
            </span>
          ))}
        </div>

        {link && (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ textDecoration: "none" }}
            onClick={(e) => {
              playClick();
            }}>
            <button 
              style={{
                ...styles.viewBtn,
                opacity: isHovered ? 1 : 0.7,
                transform: isHovered ? "translateX(4px)" : "translateX(0)",
                boxShadow: isHovered ? '0 0 20px rgba(125,249,255,0.4), inset 0 0 10px rgba(125,249,255,0.2)' : 'none',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                pointerEvents: 'none'
              }}>
              View Project →
            </button>
          </a>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   PUBLICATION CARD COMPONENT
   ============================================================ */
function PublicationCard({
  title,
  journal,
  year,
  doi,
  description,
  contribution,
  keywords,
  link,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: isHovered ? `0 20px 40px rgba(125,249,255,0.15)` : `0 8px 16px rgba(0,0,0,0.3)`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.cardContent}>
        <div style={styles.cardHeader}>
          <span style={styles.statusBadge}>📄 PUBLISHED</span>
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button style={{
                ...styles.viewBtn,
                fontSize: "12px",
                padding: "6px 12px",
              }}>
                Read →
              </button>
            </a>
          )}
        </div>

        <h3 style={styles.cardTitle}>{title}</h3>

        <p style={styles.publicationMeta}>
          {journal} • {year} • DOI: {doi}
        </p>

        <p style={styles.cardText}>
          <span style={styles.label}>Research:</span> {description}
        </p>
        <p style={styles.cardText}>
          <span style={styles.label}>Contribution:</span> {contribution}
        </p>

        <div style={styles.techRow}>
          {keywords.map((k) => (
            <span key={k} style={styles.techChip}>
              {k}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STYLES OBJECT
   ============================================================ */
const styles = {
  page: {
    backgroundColor: "#0b0f1a",
    color: "#e0e7ff",
    height: "90%",
    overflowY: "auto",
    fontFamily: "'Share Tech Mono', monospace",
    position: "relative",
    zIndex: 1,
    padding: "10px",
  },

  hero: {
    position: "relative",
    zIndex: 10,
    padding: "clamp(60px, 12vw, 120px) clamp(20px, 5vw, 100px)",
    textAlign: "center",
    marginBottom: "clamp(80px, 15vw, 160px)",
    overflow: "hidden",
  },

  cornerTL: {
    position: "absolute",
    top: "20px",
    left: "20px",
    width: "40px",
    height: "40px",
    border: "3px solid #7df9ff",
    borderRight: "none",
    borderBottom: "none",
    opacity: 0.6,
  },

  cornerTR: {
    position: "absolute",
    top: "20px",
    right: "20px",
    width: "40px",
    height: "40px",
    border: "3px solid #7df9ff",
    borderLeft: "none",
    borderBottom: "none",
    opacity: 0.6,
  },

  cornerBL: {
    position: "absolute",
    bottom: "20px",
    left: "20px",
    width: "40px",
    height: "40px",
    border: "3px solid #7df9ff",
    borderRight: "none",
    borderTop: "none",
    opacity: 0.6,
  },

  cornerBR: {
    position: "absolute",
    bottom: "20px",
    right: "20px",
    width: "40px",
    height: "40px",
    border: "3px solid #7df9ff",
    borderLeft: "none",
    borderTop: "none",
    opacity: 0.6,
  },

  heroTitle: {
    fontSize: "clamp(32px, 8vw, 64px)",
    fontWeight: 700,
    marginBottom: "24px",
    background: "linear-gradient(135deg, #7df9ff 0%, #a78bfa 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textTransform: "uppercase",
    letterSpacing: "2px",
  },

  heroSubtitle: {
    fontSize: "clamp(14px, 2.5vw, 18px)",
    opacity: 0.9,
    color: "#ffffff",
    maxWidth: "800px",
    margin: "0 auto",
    lineHeight: 1.6,
    fontFamily: "Inter, sans-serif",
  },

  contentWrapper: {
    position: "relative",
    zIndex: 10,
    padding: "0 clamp(20px, 5vw, 100px)",
    paddingBottom: "100px",
  },

  section: {
    marginBottom: "clamp(80px, 15vw, 160px)",
  },

  sectionLabel: {
    fontSize: "14px",
    color: "#7df9ff",
    opacity: 0.6,
    marginBottom: "12px",
    letterSpacing: "1px",
  },

  sectionTitle: {
    fontSize: "clamp(24px, 5vw, 48px)",
    fontWeight: 700,
    marginBottom: "12px",
    color: "#7df9ff",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  sectionSubtitle: {
    fontSize: "clamp(14px, 2vw, 16px)",
    opacity: 0.9,
    color: "#ffffff",
    marginBottom: "clamp(32px, 5vw, 48px)",
    fontFamily: "Inter, sans-serif",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(clamp(280px, 100%, 400px), 1fr))",
    gap: "clamp(20px, 3vw, 32px)",
  },

  card: {
    backgroundColor: "rgba(15, 20, 32, 0.8)",
    border: "1px solid rgba(125, 249, 255, 0.2)",
    borderRadius: "8px",
    overflow: "hidden",
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
    transition: "all 0.4s cubic-bezier(0.23, 1, 0.320, 1)",
    cursor: "pointer",
    position: "relative",
  },

  cardImage: {
    position: "relative",
    width: "100%",
    height: "200px",
    overflow: "hidden",
    borderBottom: "1px solid rgba(125, 249, 255, 0.2)",
  },

  cardImageOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)",
  },

  cardContent: {
    padding: "clamp(16px, 3vw, 24px)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },

  statusBadge: {
    fontSize: "12px",
    color: "#7df9ff",
    border: "1px solid #7df9ff",
    padding: "6px 12px",
    borderRadius: "4px",
    fontFamily: "'Share Tech Mono', monospace",
  },

  cardTitle: {
    fontSize: "clamp(16px, 3vw, 20px)",
    fontWeight: 700,
    marginBottom: "16px",
    color: "#ffffff",
  },

  cardText: {
    fontSize: "14px",
    opacity: 0.9,
    color: "#ffffff",
    lineHeight: 1.6,
    marginBottom: "12px",
    fontFamily: "Inter, sans-serif",
  },

  label: {
    color: "#7df9ff",
    fontWeight: 600,
    opacity: 0.9,
  },

  publicationMeta: {
    fontSize: "12px",
    opacity: 0.85,
    color: "#ffffff",
    marginBottom: "16px",
    fontFamily: "Inter, sans-serif",
  },

  techRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "16px",
    marginBottom: "16px",
  },

  techChip: {
    fontSize: "12px",
    padding: "6px 10px",
    borderRadius: "4px",
    backgroundColor: "rgba(125, 249, 255, 0.08)",
    border: "1px solid rgba(125, 249, 255, 0.2)",
    color: "#7df9ff",
    fontFamily: "'Share Tech Mono', monospace",
  },

  viewBtn: {
    backgroundColor: "transparent",
    color: "#7df9ff",
    border: "1px solid #7df9ff",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    fontFamily: "'Share Tech Mono', monospace",
    transition: "all 0.3s ease",
    marginTop: "12px",
    display: "inline-block",
  },
};
