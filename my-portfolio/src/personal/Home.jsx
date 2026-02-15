import { useState, useEffect, useRef } from "react";
import profileImgLogo from "../Assects/Me-GR.png";

/* ============================================================
   FONT + KEYFRAMES injection (runs once)
   ============================================================ */
(function bootstrap() {
  // fonts
  if (!document.getElementById("__home_fonts__")) {
    const f = document.createElement("link");
    f.id = "__home_fonts__";
    f.rel = "stylesheet";
    f.href =
      "https://fonts.googleapis.com/css2?" +
      "family=Rajdhani:wght@300;400;500;600;700&" +
      "family=Inter:wght@300;400;500;600&" +
      "display=swap";
    document.head.appendChild(f);
  }
  // keyframes
  if (!document.getElementById("__home_css__")) {
    const s = document.createElement("style");
    s.id = "__home_css__";
    s.textContent = `
      @keyframes fadeUp {
        from { opacity:0; transform:translateY(20px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes grain {
        0%   { transform:translate(0,0); }
        33%  { transform:translate(-2%,-1%); }
        66%  { transform:translate(1%,2%); }
        100% { transform:translate(0,0); }
      }
      @keyframes pulseGlow {
        0%,100% { box-shadow: 0 0 16px rgba(240,160,69,0.18); }
        50%     { box-shadow: 0 0 32px rgba(240,160,69,0.34); }
      }
      @keyframes ambientFloat {
        0%,100% { transform:translateY(0px); }
        50%     { transform:translateY(-6px); }
      }
      .home-fade-1 { animation: fadeUp 0.6s 0.08s cubic-bezier(.4,0,.2,1) both; }
      .home-fade-2 { animation: fadeUp 0.6s 0.18s cubic-bezier(.4,0,.2,1) both; }
      .home-fade-3 { animation: fadeUp 0.6s 0.28s cubic-bezier(.4,0,.2,1) both; }
      .home-fade-4 { animation: fadeUp 0.6s 0.38s cubic-bezier(.4,0,.2,1) both; }
      .home-fade-5 { animation: fadeUp 0.6s 0.48s cubic-bezier(.4,0,.2,1) both; }
    `;
    document.head.appendChild(s);
  }
})();

/* ============================================================
   GRAIN OVERLAY
   ============================================================ */
function Grain() {
  return (
    <div style={{
      position:"fixed", inset:"-10%", pointerEvents:"none", zIndex:0,
      opacity:0.18,
      backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize:"200px 200px",
      animation:"grain 0.5s steps(2) infinite",
    }} />
  );
}

/* ============================================================
   SOFT PARTICLE CANVAS (warm amber, low count, gentle)
   ============================================================ */
function AmbientParticles() {
  const ref = useRef(null);
  const animRef = useRef(null);
  const ptsRef = useRef([]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    ptsRef.current = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 1.2 + 0.4,
    }));

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, w, h);
      const pts = ptsRef.current;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(240,160,69,0.18)";
        ctx.fill();

        for (let j = i + 1; j < pts.length; j++) {
          const p2 = pts[j];
          const dx = p.x - p2.x, dy = p.y - p2.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(240,160,69,${0.06 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animRef.current); };
  }, []);

  return (
    <canvas ref={ref} style={{
      position:"fixed", inset:0, width:"100%", height:"100%",
      pointerEvents:"none", zIndex:0,
    }} />
  );
}

/* ============================================================
   STATUS CARD
   ============================================================ */
function StatusCard({ title, value, glowColor }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "rgba(240,160,69,0.07)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hover ? "rgba(240,160,69,0.3)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 14,
        padding: "18px 20px",
        transition: "all 0.3s ease",
        transform: hover ? "translateY(-3px)" : "none",
        boxShadow: hover ? `0 8px 28px ${glowColor || "rgba(240,160,69,0.12)"}` : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* top accent stripe */}
      <div style={{
        position:"absolute", top:0, left:0, height:2,
        width: hover ? "100%" : "0%",
        background:"linear-gradient(90deg, #f0a045, transparent)",
        transition:"width 0.4s ease",
      }} />

      <p style={{ opacity:0.5, fontSize:12, letterSpacing:1.2, textTransform:"uppercase", fontFamily:"'Rajdhani', sans-serif", fontWeight:500, marginBottom:6 }}>
        {title}
      </p>
      <strong style={{ fontSize:18, fontFamily:"'Rajdhani', sans-serif", fontWeight:700, color: hover ? "#f0a045" : "#e8ddd0", transition:"color 0.3s ease" }}>
        {value}
      </strong>
    </div>
  );
}

/* ============================================================
   THOUGHT CARD (challenge item)
   ============================================================ */
function ThoughtCard({ date, title, desc }) {
  const [hover, setHover] = useState(false);
  const isDone = date === "✓ Done";
  const isNext = date === "Next";

  const badgeColor = isDone ? "#4ade80" : isNext ? "#f0a045" : "#a78bfa";
  const badgeBg = isDone ? "rgba(74,222,128,0.12)" : isNext ? "rgba(240,160,69,0.12)" : "rgba(167,139,250,0.12)";

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display:"flex", gap:14, alignItems:"flex-start",
        background: hover ? "rgba(240,160,69,0.06)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hover ? "rgba(240,160,69,0.25)" : "rgba(255,255,255,0.06)"}`,
        padding:"16px 18px",
        borderRadius:12,
        marginBottom:12,
        transition:"all 0.3s ease",
        transform: hover ? "translateX(4px)" : "none",
      }}
    >
      {/* badge */}
      <span style={{
        background: badgeBg,
        color: badgeColor,
        fontSize:11, fontWeight:600, letterSpacing:0.6,
        padding:"4px 10px", borderRadius:20,
        whiteSpace:"nowrap", minWidth:64, textAlign:"center",
        border:`1px solid ${badgeColor}30`,
        fontFamily:"'Rajdhani', sans-serif",
        boxShadow: isDone ? `0 0 8px ${badgeColor}25` : "none",
      }}>
        {date}
      </span>

      <div style={{ flex:1 }}>
        <strong style={{ fontSize:14, color: hover ? "#fff" : "#e8ddd0", fontFamily:"'Rajdhani', sans-serif", fontWeight:600, transition:"color 0.3s ease", display:"block", marginBottom:3 }}>
          {title}
        </strong>
        <p style={{ opacity:0.5, fontSize:13, fontFamily:"'Inter', sans-serif", fontWeight:300, lineHeight:1.5 }}>
          {desc}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   METRIC BOX
   ============================================================ */
function Metric({ label, value }) {
  return (
    <div style={{ textAlign:"center" }}>
      <p style={{ fontSize:11, opacity:0.45, letterSpacing:1, textTransform:"uppercase", fontFamily:"'Rajdhani', sans-serif", fontWeight:500, marginBottom:4 }}>
        {label}
      </p>
      <strong style={{ fontSize:20, fontFamily:"'Rajdhani', sans-serif", fontWeight:700, color:"#f0a045" }}>
        {value}
      </strong>
    </div>
  );
}

/* ============================================================
   MAIN HOME
   ============================================================ */
export default function Home() {
  return (
    <div style={styles.page}>
      {/* atmosphere layers */}
      <Grain />
      <AmbientParticles />

      {/* ——— HERO ——— */}
      <section style={styles.hero} className="home-fade-1">
        <div style={styles.heroLeft}>
          <div style={styles.heroBadge}>
            <span style={styles.heroBadgeDot} />
            Personal Space
          </div>

          <h1 style={styles.heroTitle}>
            Hi, I'm <span style={{ color:"#f0a045" }}>Pavankumar</span>.<br />
            <span style={styles.heroSub}>Welcome to my digital garden.</span>
          </h1>

          <p style={styles.heroText}>
            I'm a developer by trade, but a creator at heart. This is where I
            document my fitness journey, share life experiments, and showcase
            the things that inspire me outside of code.
          </p>

          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <HeroBtn primary>Read Latest</HeroBtn>
            <HeroBtn>View Gallery</HeroBtn>
          </div>
        </div>

        <div style={styles.heroRight}>
          <div style={styles.profileFrame}>
            <img src={profileImgLogo} alt="profile" style={styles.profileImg} />
          </div>
        </div>
      </section>

      {/* ——— STATUS CARDS ——— */}
      <section style={styles.statusGrid} className="home-fade-2">
        <StatusCard title="Current Focus" value="AWS" />
        <StatusCard title="Workout Streak" value="500 Days" glowColor="rgba(74,222,128,0.15)" />
        <StatusCard title="Experiment" value="100g Protein/Day" glowColor="rgba(167,139,250,0.12)" />
        <StatusCard title="Weekly Workouts" value="6 / Week" glowColor="rgba(74,222,128,0.15)" />
      </section>

      {/* ——— CONTENT GRID ——— */}
      <section style={styles.contentGrid}>
        {/* CHALLENGES */}
        <div className="home-fade-3">
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Challenges</h3>
            <span style={styles.link}>View All →</span>
          </div>

          <ThoughtCard date="✓ Done" title="100 Rope Jumps in 30 Seconds" desc="Completed with consistent practice and technique." />
          <ThoughtCard date="Next" title="1000 Rope Jumps in 10 Minutes" desc="Building endurance and speed for the next level." />
          <ThoughtCard date="Ongoing" title="100g Protein Per Day" desc="Daily nutrition target for muscle recovery and growth." />
        </div>

        {/* LIFE IN MOTION */}
        <div className="home-fade-4">
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Life in Motion</h3>
            <span style={styles.link}>Full Gallery →</span>
          </div>

          <div style={styles.fitnessCard}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <strong style={{ fontFamily:"'Rajdhani', sans-serif", fontSize:16, fontWeight:600, color:"#e8ddd0" }}>
                Fitness Tracker
              </strong>
              <span style={{ fontSize:10, color:"#f0a04588", letterSpacing:1.2, textTransform:"uppercase", fontFamily:"'Rajdhani', sans-serif" }}>
                Live
                <span style={{ display:"inline-block", width:5, height:5, borderRadius:"50%", background:"#4ade80", marginLeft:5, boxShadow:"0 0 5px #4ade80", verticalAlign:"middle" }} />
              </span>
            </div>

            <div style={styles.fitnessGrid}>
              <Metric label="Weekly KM" value="--" />
              <Metric label="Workouts" value="--" />
              <Metric label="Steps Avg" value="--" />
              <Metric label="VO₂ Max" value="--" />
            </div>
          </div>

          <div style={styles.imageGrid}>
            <div style={styles.lifeImg}><span style={styles.imgPlaceholderText}>[ Photo ]</span></div>
            <div style={styles.lifeImg}><span style={styles.imgPlaceholderText}>[ Photo ]</span></div>
          </div>
        </div>
      </section>

      {/* ——— FOOTER ——— */}
      <footer style={styles.footer} className="home-fade-5">
        <p style={{ opacity:0.4, fontSize:13, fontFamily:"'Inter', sans-serif", fontWeight:300 }}>
          © 2025 Pavan Suryawanshi. Crafted with curiosity.
        </p>
        <div style={{ display:"flex", gap:18 }}>
          {["📷 Instagram", "𝕏 Twitter", "⚡ GitHub"].map((item) => (
            <FooterLink key={item}>{item}</FooterLink>
          ))}
        </div>
      </footer>
    </div>
  );
}

/* ============================================================
   HERO BUTTON
   ============================================================ */
function HeroBtn({ children, primary }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: primary
          ? hover ? "linear-gradient(135deg, #f0a045, #e08530)" : "linear-gradient(135deg, #f0a045, #d4944a)"
          : hover ? "rgba(240,160,69,0.1)" : "rgba(255,255,255,0.05)",
        color: primary ? "#0d0a14" : "#e8ddd0",
        border: primary ? "none" : `1px solid ${hover ? "rgba(240,160,69,0.35)" : "rgba(255,255,255,0.12)"}`,
        padding: "11px 24px",
        borderRadius: 10,
        fontWeight: 600,
        fontSize: 14,
        cursor: "pointer",
        fontFamily: "'Rajdhani', sans-serif",
        letterSpacing: 0.5,
        transition: "all 0.25s ease",
        transform: hover ? "translateY(-2px)" : "none",
        boxShadow: primary && hover ? "0 6px 20px rgba(240,160,69,0.3)" : "none",
      }}
    >
      {children}
    </button>
  );
}

/* ============================================================
   FOOTER LINK
   ============================================================ */
function FooterLink({ children }) {
  const [hover, setHover] = useState(false);
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        color: hover ? "#f0a045" : "rgba(220,200,200,0.4)",
        fontSize: 13,
        cursor: "pointer",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 400,
        transition: "color 0.25s ease",
        letterSpacing: 0.3,
      }}
    >
      {children}
    </span>
  );
}

/* ============================================================
   STYLES — page shell UNTOUCHED (height 85%, overflow auto)
   ============================================================ */
const styles = {
  page: {
    backgroundColor: "#0d0a14",
    color: "#ffffff",
    padding: "0% 5%",
    fontFamily: "'Inter', sans-serif",
    height: "85%",
    overflow: "auto",
    position: "relative",
    zIndex: 1,
    background:
      "radial-gradient(ellipse at 58% 0%, #1a1428 0%, transparent 55%), " +
      "radial-gradient(ellipse at 15% 80%, #151020 0%, transparent 50%), " +
      "#0d0a14",
  },

  /* hero */
  hero: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: 60,
    marginBottom: 80,
    paddingTop: "clamp(24px, 4vw, 48px)",
  },
  heroLeft: { display:"flex", flexDirection:"column", justifyContent:"center" },

  heroBadge: {
    display:"inline-flex", alignItems:"center", gap:8,
    padding:"5px 14px", borderRadius:20,
    background:"rgba(240,160,69,0.08)", border:"1px solid rgba(240,160,69,0.2)",
    color:"#f0a045", fontSize:11, fontWeight:600, letterSpacing:1.4,
    textTransform:"uppercase", marginBottom:22,
    width:"fit-content",
    fontFamily:"'Rajdhani', sans-serif",
  },
  heroBadgeDot: {
    width:6, height:6, borderRadius:"50%", background:"#4ade80",
    boxShadow:"0 0 6px #4ade80",
  },

  heroTitle: {
    fontSize:"clamp(30px, 5vw, 42px)",
    fontWeight:700,
    lineHeight:1.25,
    marginBottom:18,
    fontFamily:"'Rajdhani', sans-serif",
    color:"#e8ddd0",
  },
  heroSub: {
    fontSize:"clamp(22px, 3.5vw, 28px)",
    fontWeight:300,
    color:"rgba(220,200,190,0.6)",
    fontFamily:"'Rajdhani', sans-serif",
  },

  heroText: {
    opacity:0.55,
    maxWidth:520,
    lineHeight:1.8,
    marginBottom:28,
    fontSize:"clamp(13px, 1.7vw, 15px)",
    fontFamily:"'Inter', sans-serif",
    fontWeight:300,
    color:"#c8b8a8",
  },

  heroRight: {
    display:"flex",
    justifyContent:"flex-end",
    alignItems:"center",
  },
  profileFrame: {
    position:"relative",
    borderRadius:20,
    padding:3,
    background:"linear-gradient(135deg, rgba(240,160,69,0.4), rgba(240,160,69,0.05) 60%, rgba(167,139,250,0.2))",
    animation:"pulseGlow 3s ease infinite",
  },
  profileImg: {
    width:280,
    height:340,
    borderRadius:18,
    objectFit:"cover",
    display:"block",
    backgroundColor:"#1a1520",
  },

  /* status grid */
  statusGrid: {
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit, minmax(170px, 1fr))",
    gap:16,
    marginBottom:72,
  },

  /* content grid */
  contentGrid: {
    display:"grid",
    gridTemplateColumns:"1fr 1fr",
    gap:56,
    marginBottom:90,
  },

  sectionHeader: {
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:18,
  },
  sectionTitle: {
    fontFamily:"'Rajdhani', sans-serif",
    fontSize:"clamp(17px, 2.5vw, 20px)",
    fontWeight:600,
    color:"#e8ddd0",
  },
  link: {
    color:"#f0a045",
    fontSize:13,
    cursor:"pointer",
    fontFamily:"'Rajdhani', sans-serif",
    fontWeight:500,
    letterSpacing:0.3,
    transition:"opacity 0.2s ease",
  },

  /* fitness card */
  fitnessCard: {
    background:"rgba(255,255,255,0.03)",
    border:"1px solid rgba(240,160,69,0.14)",
    borderRadius:14,
    padding:"20px 22px",
    marginBottom:18,
  },
  fitnessGrid: {
    display:"grid",
    gridTemplateColumns:"1fr 1fr",
    gap:"16px 12px",
  },

  /* image grid placeholders */
  imageGrid: {
    display:"grid",
    gridTemplateColumns:"1fr 1fr",
    gap:12,
  },
  lifeImg: {
    width:"100%",
    height:150,
    borderRadius:12,
    background:"linear-gradient(135deg, rgba(240,160,69,0.06), rgba(167,139,250,0.04))",
    border:"1px solid rgba(255,255,255,0.06)",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
  },
  imgPlaceholderText: {
    fontSize:11,
    color:"rgba(240,160,69,0.3)",
    letterSpacing:1.5,
    fontFamily:"'Rajdhani', sans-serif",
  },

  /* footer */
  footer: {
    borderTop:"1px solid rgba(255,255,255,0.06)",
    paddingTop:28,
    paddingBottom:16,
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
  },
};