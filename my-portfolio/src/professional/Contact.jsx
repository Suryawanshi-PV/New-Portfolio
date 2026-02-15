import { useState, useEffect, useRef } from "react";
import { useSound } from "../hooks/useSound";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

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

export default function Contact() {
  const [glitchActive, setGlitchActive] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const { playGlitch, playHover, playClick, playAmbient } = useSound();
  const titleGlitch = useGlitch("Let's Connect", glitchActive);

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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    playClick();
    const subject = encodeURIComponent(formData.subject || "Contact from portfolio");
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n\n` +
      `${formData.message}`
    );
    window.location.href = `mailto:pavansuryawanshi475@gmail.com?subject=${subject}&body=${body}`;
  };

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
          Have a project in mind or want to discuss opportunities? I'd love to hear from you.
        </p>
      </section>

      <div style={styles.contentWrapper}>
        {/* CONTACT INFORMATION SECTION */}
        <section style={styles.section}>
          <div style={styles.sectionLabel}>[01]</div>
          <h2 style={styles.sectionTitle}>Contact Information</h2>
          
          <div style={styles.contactGrid}>
            <ContactCard icon={<MailIcon />} title="Email" value="Pavansuryawanshi475@gmail.com" href="mailto:Pavansuryawanshi475@gmail.com" playHover={playHover} playClick={playClick} />
            <ContactCard icon={<PhoneIcon />} title="Phone" value="+91 7057841107" href="tel:+917057841107" playHover={playHover} playClick={playClick} />
            <ContactCard icon={<LocationOnIcon />} title="Location" value="Malawa 445211" playHover={playHover} />
          </div>
        </section>

        {/* CONTACT FORM SECTION */}
        <section style={styles.section}>
          <div style={styles.sectionLabel}>[02]</div>
          <h2 style={styles.sectionTitle}>Send Message</h2>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Your Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = "#7df9ff";
                  e.target.style.backgroundColor = "rgba(125, 249, 255, 0.05)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(125, 249, 255, 0.3)";
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = "#7df9ff";
                  e.target.style.backgroundColor = "rgba(125, 249, 255, 0.05)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(125, 249, 255, 0.3)";
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="What is this about?"
                value={formData.subject}
                onChange={handleChange}
                required
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = "#7df9ff";
                  e.target.style.backgroundColor = "rgba(125, 249, 255, 0.05)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(125, 249, 255, 0.3)";
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Message</label>
              <textarea
                name="message"
                placeholder="Your message here..."
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                style={{ ...styles.input, resize: "vertical" }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#7df9ff";
                  e.target.style.backgroundColor = "rgba(125, 249, 255, 0.05)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(125, 249, 255, 0.3)";
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                }}
              />
            </div>

            <button type="submit" style={styles.submitBtn}>
              Send Message →
            </button>
          </form>
        </section>

        {/* SOCIAL LINKS SECTION */}
        <section style={styles.section}>
          <div style={styles.sectionLabel}>[03]</div>
          <h2 style={styles.sectionTitle}>Follow Me</h2>
          <p style={styles.sectionSubtext}>Connect with me on social media for updates and insights</p>
          
          <div style={styles.socialLinks}>
            <a
              href="https://www.linkedin.com/in/pavankumar-suryawanshi-162210191/"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.socialIcon}
              onClick={playClick}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(125, 249, 255, 0.2)";
                e.currentTarget.style.transform = "translateY(-4px)";
                playHover?.();
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(125, 249, 255, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <LinkedInIcon sx={{ fontSize: 20 }} />
            </a>
            <a
              href="https://github.com/Suryawanshi-PV"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.socialIcon}
              onClick={playClick}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(125, 249, 255, 0.2)";
                playHover?.();
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(125, 249, 255, 0.1)";
              }}
            >
              <GitHubIcon sx={{ fontSize: 20 }} />
            </a>
          </div>
        </section>

        {/* FOOTER NOTE */}
        <section style={styles.footerNote}>
          <p>I usually respond within 24 hours. Looking forward to connecting with you!</p>
        </section>
      </div>
    </div>
  );
}

/* ============================================================
   CONTACT CARD COMPONENT
   ============================================================ */
function ContactCard({ icon, title, value, href, playHover, playClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href || "#"}
      style={{
        ...styles.contactCard,
        textDecoration: "none",
        color: "inherit",
        borderColor: isHovered ? "rgba(125,249,255,0.4)" : "rgba(125,249,255,0.2)",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        playHover?.();
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={playClick}
    >
      <div style={styles.cardIcon}>{icon}</div>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardValue}>{value}</p>
    </a>
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
    marginBottom: "32px",
    color: "#7df9ff",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  sectionSubtext: {
    fontSize: "clamp(13px, 2vw, 15px)",
    opacity: 0.9,
    color: "#ffffff",
    marginBottom: "24px",
    fontFamily: "Inter, sans-serif",
  },

  contactGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(clamp(200px, 100%, 280px), 1fr))",
    gap: "clamp(16px, 3vw, 24px)",
  },

  contactCard: {
    padding: "clamp(20px, 3vw, 28px)",
    backgroundColor: "rgba(15, 20, 32, 0.8)",
    border: "1px solid rgba(125, 249, 255, 0.2)",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    cursor: "pointer",
    textAlign: "center",
  },

  cardIcon: {
    fontSize: "28px",
    marginBottom: "12px",
    color: "#7df9ff",
  },

  cardTitle: {
    fontSize: "clamp(14px, 2.2vw, 16px)",
    fontWeight: 600,
    color: "#7df9ff",
    marginBottom: "8px",
  },

  cardValue: {
    fontSize: "clamp(13px, 2vw, 14px)",
    opacity: 0.9,
    color: "#ffffff",
    fontFamily: "Inter, sans-serif",
  },

  form: {
    maxWidth: "600px",
    backgroundColor: "rgba(15, 20, 32, 0.8)",
    border: "1px solid rgba(125, 249, 255, 0.2)",
    borderRadius: "8px",
    padding: "clamp(24px, 4vw, 36px)",
  },

  formGroup: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "clamp(12px, 1.8vw, 14px)",
    color: "#7df9ff",
    fontWeight: 600,
  },

  input: {
    width: "100%",
    padding: "clamp(10px, 2vw, 14px)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(125, 249, 255, 0.3)",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "clamp(13px, 2vw, 14px)",
    fontFamily: "Inter, sans-serif",
    transition: "all 0.3s ease",
    outline: "none",
    boxSizing: "border-box",
  },

  submitBtn: {
    width: "100%",
    padding: "clamp(12px, 2vw, 14px)",
    backgroundColor: "transparent",
    color: "#7df9ff",
    border: "1px solid #7df9ff",
    borderRadius: "6px",
    fontSize: "clamp(13px, 1.8vw, 14px)",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "'Share Tech Mono', monospace",
  },

  socialLinks: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },

  socialIcon: {
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(125, 249, 255, 0.1)",
    border: "1px solid rgba(125, 249, 255, 0.3)",
    borderRadius: "6px",
    color: "#7df9ff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textDecoration: "none",
  },

  footerNote: {
    textAlign: "center",
    paddingTop: "clamp(40px, 5vw, 60px)",
    borderTop: "1px solid rgba(125, 249, 255, 0.1)",
    marginTop: "clamp(60px, 10vw, 100px)",
  },
};
