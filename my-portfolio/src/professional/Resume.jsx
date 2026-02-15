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

export default function Resume() {
  const [glitchActive, setGlitchActive] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const { playGlitch, playHover, playClick, playAmbient } = useSound();
  const titleGlitch = useGlitch("Professional Resume", glitchActive);

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
          Pavankumar Suryawanshi | GIS Developer & Full-Stack Specialist
        </p>
        <div style={styles.heroMeta}>
          <span>📧 Pavansuryawanshi475@gmail.com</span>
          <span>📞 +91 7057841107</span>
          <a href={ResumePDF} download="Pavankumar_Suryawanshi_Resume.pdf" onClick={playClick} style={styles.downloadLink}>
            ⬇ Download PDF
          </a>
        </div>
      </section>

      <div style={styles.contentWrapper}>

        {/* PROFESSIONAL SUMMARY */}
        <Section label="[01]" title="Professional Summary">
          <p style={styles.paragraph}>
            Skilled GIS Developer specializing in full-stack geospatial application development. 
            Proficient in React, TypeScript, FastAPI, and PostgreSQL/PostGIS with expertise in 
            cloud-native architecture on AWS. Experienced in building scalable spatial data platforms, 
            raster processing, and integrating GeoServer for spatial data publishing. Proven ability 
            to work independently and deliver end-to-end geospatial solutions.
          </p>
        </Section>

        {/* TECHNICAL SKILLS */}
        <Section label="[02]" title="Technical Skills">
          <div style={styles.skillsGrid}>
            <SkillColumn
              title="Frontend / Web-Design"
              items={[
                "ReactJS",
                "TypeScript",
                "JavaScript",
                "HTML & CSS",
                "jQuery",
              ]}
            />

            <SkillColumn
              title="Backend & Database"
              items={[
                "Python (FastAPI)",
                "REST API Design",
                "PostgreSQL",
                "PostGIS",
                "Python Automation",
              ]}
            />

            <SkillColumn
              title="Geospatial Technologies"
              items={[
                "GeoServer",
                "QGIS",
                "ArcGIS Pro",
                "Mapbox",
                "OpenLayers",
              ]}
            />

            <SkillColumn
              title="Cloud & Deployment"
              items={[
                "AWS (EC2, RDS, S3)",
                "Docker",
                "Cloud Architecture",
                "Raster Processing (GDAL)",
                "Spatial Data Analysis",
              ]}
            />
          </div>
        </Section>

        {/* WORK EXPERIENCE */}
        <Section label="[03]" title="Work Experience">
          <Experience
            role="GIS Developer"
            company="StoryPeach Technologies Private Limited (TreeStock)"
            period="May 2025 – Present"
            location="Remote (Sheffield, UK)"
            points={[
              "Sole developer building the TreeStock Product, a geospatial platform for urban forestry surveys and visualization.",
              "Architected and developed the full stack using React (TypeScript) for frontend, FastAPI for backend, PostgreSQL + PostGIS for spatial database management, and GeoServer for spatial data publishing.",
              "Deployed cloud infrastructure on AWS (EC2, RDS, S3), to ensure scalability, performance, and availability of geospatial services.",
              "Implemented advanced raster clipping and tree feature rendering, visualizing survey-based forestry datasets from drone teams.",
            ]}
          />

          <Experience
            role="Junior GIS Developer"
            company="RSI Softech India Pvt. Ltd."
            period="Dec 2022 – Apr 2025"
            location="Hyderabad, India"
            points={[
              "Built GIS web applications using React.js and ArcGIS Experience Builder, creating interactive and analytical user experiences.",
              "Worked extensively with ArcGIS Pro for map creation, geoprocessing, and advanced spatial analysis.",
              "Contributed to environmental monitoring dashboard projects, integrating analytical visualization and geospatial analytics.",
            ]}
          />
        </Section>

        {/* PROJECTS */}
        <Section label="[04]" title="Projects">
          <Experience
            role="TreeStock Product"
            company="Technologies: React (TypeScript), FastAPI, PostgreSQL/PostGIS, GeoServer, AWS"
            period="May 2025 – Present"
            points={[
              "Developed a comprehensive urban forestry survey and visualization platform for environmental monitoring.",
              "Visualizes drone-collected survey data, including tree species, root protection areas, and trunk parameters.",
              "Designed backend APIs for raster processing, survey data management, and visualization logic.",
              "Built on a cloud-native architecture deployed through AWS EC2, RDS, and S3, supporting scalable operations.",
              "Currently leading product evolution toward automated ML-based survey generation workflows.",
            ]}
          />

          <Experience
            role="Municipal Tenancy Web Application Enhancement"
            company="Geospatial Technology Project"
            period="Jan 2024 – Nov 2024"
            points={[
              "Developed a versatile tenancy application for web and mobile platforms, featuring robust search capabilities by area and rental value.",
              "Led the development of the mobile version, optimizing UI for smaller screens and integrating map functionality for intuitive area selection.",
            ]}
          />

          <Experience
            role="Real-Time Data Visualization with Apache ECharts"
            company="Dashboard Development"
            period="Jul 2023 – Dec 2023"
            points={[
              "Developed and maintained the Employee Visit Dashboard chart component using Apache ECharts to provide real-time insights into employee visits.",
            ]}
            link="https://suryawanshi-pv.github.io/Crime-Dashboard/"
          />
        </Section>

        {/* EDUCATION & CERTIFICATIONS */}
        <div style={styles.twoColGrid}>
          <Section label="[05]" title="Education">
            <p style={styles.bold}>M.Sc. Geoinformatics</p>
            <p style={styles.muted}>Symbiosis Institute of Geoinformatics · 2021 – 2023</p>
            <p style={styles.muted}>Pune, India · CGPA: 6.92</p>
          </Section>

          <Section label="[06]" title="Certifications">
            <p style={styles.bold}>AWS Cloud Practitioner Essentials</p>
            <p style={styles.muted}>Completed August 30, 2025</p>

            <p style={{ ...styles.bold, marginTop: 16 }}>
              AWS Technical Essentials
            </p>
            <p style={styles.muted}>Completed August 15, 2025</p>
            
            <a 
              href="https://www.linkedin.com/feed/update/urn:li:activity:7367583212782407682/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.certLink}
            >
              View Certificates →
            </a>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION COMPONENT
   ============================================================ */
function Section({ label, title, children }) {
  return (
    <section style={styles.section}>
      {label && <div style={styles.sectionLabel}>{label}</div>}
      <h2 style={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}

/* ============================================================
   EXPERIENCE CARD COMPONENT
   ============================================================ */
function Experience({ role, company, period, points, location, link }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.experienceCard,
        transform: isHovered ? "translateX(8px)" : "translateX(0)",
        borderLeftColor: isHovered ? "#7df9ff" : "rgba(125,249,255,0.2)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.expHeader}>
        <strong style={{ color: "#7df9ff" }}>{role}</strong>
        <span style={styles.expPeriod}>{period}</span>
      </div>
      <p style={styles.expCompany}>{company}</p>
      {location && <p style={styles.expLocation}>{location}</p>}
      <ul style={styles.list}>
        {points.map((p) => (
          <li key={p} style={styles.listItem}>{p}</li>
        ))}
      </ul>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" style={styles.expLink}>
          View Project →
        </a>
      )}
    </div>
  );
}

/* ============================================================
   SKILL CARD COMPONENT
   ============================================================ */
function SkillColumn({ title, items }) {
  return (
    <div style={styles.skillCard}>
      <h4 style={styles.skillTitle}>{title}</h4>
      <ul style={styles.list}>
        {items.map((item) => (
          <li key={item} style={styles.listItem}>{item}</li>
        ))}
      </ul>
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
    marginBottom: "20px",
    fontFamily: "Inter, sans-serif",
  },

  heroMeta: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "clamp(16px, 4vw, 24px)",
    fontSize: "clamp(12px, 2vw, 14px)",
    opacity: 0.9,
    color: "#ffffff",
    fontFamily: "Inter, sans-serif",
  },

  downloadLink: {
    color: "#7df9ff",
    textDecoration: "none",
    fontWeight: 600,
    padding: "8px 16px",
    border: "1px solid #7df9ff",
    borderRadius: "4px",
    transition: "all 0.3s ease",
    cursor: "pointer",
    display: "inline-block",
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
    marginBottom: "32px",
    color: "#7df9ff",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  skillCard: {
    padding: "clamp(16px, 3vw, 24px)",
    backgroundColor: "rgba(15, 20, 32, 0.8)",
    border: "1px solid rgba(125, 249, 255, 0.2)",
    borderRadius: "8px",
    transition: "all 0.3s ease",
  },

  skillTitle: {
    fontSize: "clamp(14px, 2vw, 16px)",
    fontWeight: 600,
    color: "#7df9ff",
    marginBottom: "16px",
  },

  skillsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(clamp(200px, 100%, 280px), 1fr))",
    gap: "clamp(16px, 3vw, 24px)",
  },

  experienceCard: {
    padding: "clamp(16px, 3vw, 24px)",
    backgroundColor: "rgba(15, 20, 32, 0.8)",
    border: "1px solid rgba(125, 249, 255, 0.2)",
    borderLeft: "3px solid rgba(125,249,255,0.2)",
    borderRadius: "8px",
    marginBottom: "20px",
    transition: "all 0.3s ease",
  },

  expHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "8px",
  },

  expPeriod: {
    fontSize: "12px",
    opacity: 0.6,
    color: "#7df9ff",
  },

  expCompany: {
    color: "#7df9ff",
    fontSize: "clamp(13px, 2vw, 14px)",
    marginBottom: "4px",
    fontWeight: 600,
  },

  expLocation: {
    fontSize: "12px",
    opacity: 0.85,
    color: "#ffffff",
    marginBottom: "12px",
    fontFamily: "Inter, sans-serif",
  },

  expLink: {
    color: "#7df9ff",
    fontSize: "12px",
    textDecoration: "none",
    marginTop: "12px",
    display: "inline-block",
    fontWeight: 600,
  },

  list: {
    paddingLeft: "18px",
    marginTop: "12px",
  },

  listItem: {
    marginBottom: "8px",
    opacity: 0.9,
    color: "#ffffff",
    fontSize: "clamp(13px, 2vw, 14px)",
    fontFamily: "Inter, sans-serif",
    lineHeight: "1.6",
  },

  paragraph: {
    opacity: 0.9,
    color: "#ffffff",
    lineHeight: 1.7,
    fontSize: "clamp(13px, 2vw, 14px)",
    fontFamily: "Inter, sans-serif",
  },

  bold: {
    fontWeight: 600,
    fontSize: "clamp(13px, 2vw, 14px)",
  },

  muted: {
    opacity: 0.85,
    color: "#ffffff",
    fontSize: "clamp(12px, 1.8vw, 13px)",
  },

  twoColGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(clamp(280px, 100%, 400px), 1fr))",
    gap: "clamp(32px, 5vw, 48px)",
  },

  certLink: {
    color: "#7df9ff",
    fontSize: "12px",
    textDecoration: "none",
    display: "inline-block",
    marginTop: "12px",
    fontWeight: 600,
  },
};
