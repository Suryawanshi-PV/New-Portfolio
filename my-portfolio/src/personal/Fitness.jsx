import { useState, useEffect, useRef } from "react";

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
   AMBIENT PARTICLES
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

export default function Fitness() {
  return (
    <div className="personal-page fitness-page" style={styles.page}>
      <Grain />
      <AmbientParticles />

      {/* HERO */}
      <section style={styles.hero}>
        <span style={styles.tag}>THE PHYSICAL GRIND</span>
        <h1 style={styles.heroTitle}>
          Building functionality,<br />
          endurance, and discipline.
        </h1>
        <p style={styles.heroText}>
          Real data from my training logs. No filters, just consistent effort
          towards running further and lifting heavier.
        </p>
      </section>

      {/* STATS */}
      <section style={styles.statsGrid}>
        <StatCard label="Yearly Running Goal" value="840 km" note="Target: 1200 km" />
        <StatCard label="Body Weight" value="74.5 kg" note="Stable since May" />
        <StatCard label="Sleep Avg (30d)" value="7h 12m" note="Since 1st May" />
        <StatCard label="Active Streak" value="14 days" note="Best: 18 days" />
      </section>

      {/* CURRENT SPLIT + HABITS */}
      <section style={styles.twoCol}>
        {/* SPLIT */}
        <div>
          <SectionHeader title="Current Split" />
          <SplitItem day="MON" title="Upper Body Power" desc="Bench Press · Overhead Press · Pull-ups" status="Complete" />
          <SplitItem day="TUE" title="Zone 2 Run" desc="5–8 km @ easy pace" status="Complete" />
          <SplitItem day="WED" title="Lower Body Strength" desc="Squats · RDLs · Lunges" status="Today" />
          <SplitItem day="THU" title="Tempo Run" desc="Intervals & pacing" status="Upcoming" />
          <SplitItem day="FRI" title="Full Body Hypertrophy" desc="Volume focus · accessories" status="Upcoming" />
          <SplitItem day="SAT" title="Active Recovery / Long Run" desc="Yoga or 10–15 km run" status="Optional" />
        </div>

        {/* HABITS */}
        <div style={styles.habitBox}>
          <strong style={{ fontFamily:"'Rajdhani', sans-serif", color:"#e8ddd0" }}>Habit Consistency (Last 7 Days)</strong>
          <Habit label="Creatine" level={5} />
          <Habit label="No Sugar" level={4} />
          <Habit label="Stretching" level={4} />
          <Habit label="Reading (20m)" level={5} />

          <div style={{ marginTop: 20 }}>
            <strong style={{ fontFamily:"'Rajdhani', sans-serif", color:"#e8ddd0" }}>Gear Rotation</strong>
            <div style={styles.gearCard}>
              <span style={styles.badgeRed}>Nike Pegasus 40</span>
              <p style={{ fontSize: 13, opacity: 0.5, marginTop: 6 }}>
                320km · Rotation ready
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section style={styles.quote}>
        <p style={styles.quoteText}>
          "It gets easier. Every day it gets a little easier. But you gotta do
          it every day — that's the hard part. But it does get easier."
        </p>
        <span style={{ opacity: 0.5, fontFamily:"'Inter', sans-serif", fontSize:13 }}>— BoJack Horseman</span>
      </section>

      {/* MILESTONES */}
      <section>
        <SectionHeader title="Milestones" />
        <Milestone
          date="OCT 2024 · CURRENT"
          title="Sub 22-min 5K"
          desc="Finally broke the 22-minute barrier on a flat course. Average pace 4:22/km. Next target: sub 45-min 10K."
        />
        <Milestone
          date="JUNE 2023"
          title="First Half Marathon"
          desc="Completed my first official half marathon. Time: 1:48:12. Felt strong till km 18, then the wall hit."
        />
        <Milestone
          date="JAN 2023"
          title="Consistent 5AM Wakeups"
          desc="The habit that changed everything. Shifted workouts to mornings before coding. 90% adherence rate for Q1."
        />
      </section>
    </div>
  );
}

/* ============================================================
   COMPONENTS
   ============================================================ */
function StatCard({ label, value, note }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "rgba(240,160,69,0.07)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hover ? "rgba(240,160,69,0.25)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 14,
        padding: "18px 20px",
        transition: "all 0.3s ease",
        transform: hover ? "translateY(-3px)" : "none",
      }}
    >
      <p style={{ opacity:0.5, fontSize:12, letterSpacing:1, fontFamily:"'Rajdhani', sans-serif", marginBottom:6 }}>
        {label}
      </p>
      <strong style={{ fontSize:20, fontFamily:"'Rajdhani', sans-serif", fontWeight:700, color: hover ? "#f0a045" : "#e8ddd0", transition:"color 0.3s ease" }}>
        {value}
      </strong>
      <p style={{ fontSize:11, opacity:0.4, marginTop:4, fontFamily:"'Inter', sans-serif" }}>{note}</p>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <h3 style={{ marginBottom: 18, fontFamily:"'Rajdhani', sans-serif", fontSize:20, fontWeight:600, color:"#e8ddd0" }}>
      {title}
    </h3>
  );
}

function SplitItem({ day, title, desc, status }) {
  const [hover, setHover] = useState(false);
  const statusColor = status === "Complete" ? "#4ade80" : status === "Today" ? "#f0a045" : "rgba(220,200,190,0.4)";
  const statusBg = status === "Complete" ? "rgba(74,222,128,0.12)" : status === "Today" ? "rgba(240,160,69,0.12)" : "rgba(255,255,255,0.03)";

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display:"flex", gap:14, alignItems:"center",
        background: hover ? "rgba(240,160,69,0.06)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hover ? "rgba(240,160,69,0.25)" : "rgba(255,255,255,0.06)"}`,
        padding:"14px 16px",
        borderRadius:12,
        marginBottom:10,
        transition:"all 0.3s ease",
      }}
    >
      <span style={{ fontSize:12, color:"#f0a045", minWidth:36, fontFamily:"'Rajdhani', sans-serif", fontWeight:600 }}>
        {day}
      </span>
      <div style={{ flex: 1 }}>
        <strong style={{ fontFamily:"'Rajdhani', sans-serif", fontSize:14, color:"#e8ddd0" }}>{title}</strong>
        <p style={{ fontSize: 13, opacity: 0.5, marginTop:2, fontFamily:"'Inter', sans-serif" }}>{desc}</p>
      </div>
      <span style={{
        fontSize:11, padding:"4px 10px", borderRadius:20,
        backgroundColor: statusBg, color: statusColor,
        border:`1px solid ${statusColor}30`,
        fontFamily:"'Rajdhani', sans-serif", fontWeight:600,
      }}>
        {status}
      </span>
    </div>
  );
}

function Habit({ label, level }) {
  return (
    <div style={{ marginTop: 14 }}>
      <p style={{ fontSize: 13, opacity: 0.6, fontFamily:"'Inter', sans-serif", marginBottom:6 }}>{label}</p>
      <div style={{ display: "flex", gap: 4 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            style={{
              width: 14,
              height: 6,
              backgroundColor: i < level ? "#f0a045" : "rgba(255,255,255,0.08)",
              borderRadius: 2,
              transition:"all 0.2s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Milestone({ date, title, desc }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "rgba(240,160,69,0.06)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hover ? "rgba(240,160,69,0.25)" : "rgba(255,255,255,0.06)"}`,
        padding:18,
        borderRadius:12,
        marginBottom:14,
        transition:"all 0.3s ease",
        transform: hover ? "translateX(4px)" : "none",
      }}
    >
      <span style={{ color:"#f0a045", fontSize:11, fontFamily:"'Rajdhani', sans-serif", fontWeight:600, letterSpacing:1 }}>
        {date}
      </span>
      <strong style={{ display:"block", marginTop:6, fontFamily:"'Rajdhani', sans-serif", fontSize:15, color:"#e8ddd0" }}>
        {title}
      </strong>
      <p style={{ fontSize: 13, opacity: 0.5, marginTop:4, fontFamily:"'Inter', sans-serif", lineHeight:1.6 }}>{desc}</p>
    </div>
  );
}

/* ============================================================
   STYLES
   ============================================================ */
const styles = {
  page: {
    backgroundColor: "#0d0a14",
    color: "#ffffff",
    padding: "0 var(--personal-pad, 5%)",
    fontFamily: "'Inter', sans-serif",
    height: "auto",
    minHeight: "100vh",
    overflow: "auto",
    position: "relative",
    zIndex: 1,
    background:
      "radial-gradient(ellipse at 58% 0%, #1a1428 0%, transparent 55%), " +
      "radial-gradient(ellipse at 15% 80%, #151020 0%, transparent 50%), " +
      "#0d0a14",
  },
  hero: {
    maxWidth: 720,
    marginBottom: 60,
    paddingTop: 24,
  },
  tag: {
    color: "#f0a045",
    fontSize: 11,
    letterSpacing: 2,
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 600,
  },
  heroTitle: {
    fontSize: "clamp(30px, 5vw, 42px)",
    fontWeight: 700,
    lineHeight: 1.25,
    margin: "14px 0 18px",
    fontFamily: "'Rajdhani', sans-serif",
    color: "#e8ddd0",
  },
  heroText: {
    opacity: 0.55,
    lineHeight: 1.8,
    fontFamily: "'Inter', sans-serif",
    fontSize: 15,
    color: "#c8b8a8",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(var(--fitness-stats-min, 180px), 1fr))",
    gap: 16,
    marginBottom: 70,
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "var(--fitness-two-cols, 2fr 1fr)",
    gap: "var(--fitness-two-gap, 40px)",
    marginBottom: 80,
  },
  habitBox: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(240,160,69,0.14)",
    borderRadius: 14,
    padding: "20px 22px",
  },
  gearCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  badgeRed: {
    backgroundColor: "rgba(255,107,107,0.12)",
    color: "#ff6b6b",
    fontSize: 12,
    padding: "4px 10px",
    borderRadius: 6,
    border: "1px solid rgba(255,107,107,0.3)",
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 600,
  },
  quote: {
    textAlign: "center",
    marginBottom: 80,
    padding: "var(--fitness-quote-pad, 0 10%)",
  },
  quoteText: {
    fontStyle: "italic",
    opacity: 0.6,
    maxWidth: 720,
    margin: "0 auto 12px",
    fontSize: 16,
    lineHeight: 1.7,
    fontFamily: "'Inter', sans-serif",
    color: "#c8b8a8",
  },
};
