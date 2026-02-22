import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";


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

const recentPosts = [
  {
    title: "Groundwater Potential Mapping with MIF + ROC Validation",
    desc: "A behind-the-paper walkthrough of how Multi-Influencing Factor modeling and ROC validation shaped our Pune region groundwater zoning study.",
    date: "Oct 28",
    read: "7 min read",
    category: "Tech & GIS",
  },
  {
    title: "Visualizing Large Scale Point Clouds with Potree & React",
    desc: "How I tuned Potree rendering and React lifecycle to keep 100M+ points interactive in the browser.",
    date: "Oct 24",
    read: "8 min read",
    category: "Tech & GIS",
  },
  {
    title: "How I Hit 100g Protein on a Vegetarian Diet (No Fancy Stuff)",
    desc: "Protein-first, simple Indian meals: shakes around workouts, soya and besan at lunch, paneer at dinner. Balance carbs with protein to stay full and recover better.",
    date: "Oct 12",
    read: "6 min read",
    category: "Fitness & Health",
  },
];

const categoryOrder = [
  "All Posts",
  "Tech & GIS",
  "Fitness & Health",
  "Life Experiments",
  "Learning",
  "Gaming & Hobbies",
];

export default function Journal() {
  const location = useLocation();
  const navigate = useNavigate();
  const recentPostsRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("All Posts");
  const categoryCounts = categoryOrder.reduce((acc, label) => {
    if (label === "All Posts") {
      acc[label] = recentPosts.length;
    } else {
      acc[label] = recentPosts.filter((post) => post.category === label).length;
    }
    return acc;
  }, {});

  const filteredPosts = activeCategory === "All Posts"
    ? recentPosts
    : recentPosts.filter((post) => post.category === activeCategory);

  useEffect(() => {
    if (!location.state?.scrollToRecentPosts) return;

    requestAnimationFrame(() => {
      recentPostsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      navigate(location.pathname, { replace: true, state: {} });
    });
  }, [location.pathname, location.state, navigate]);

  return (
    <div className="personal-page journal-page" style={styles.page}>
      <Grain />
      <AmbientParticles />

      <div style={styles.layout}>
        {/* SIDEBAR */}
        <aside style={styles.sidebar}>
          <span style={styles.sidebarTitle}>Explore Topics</span>

          <div style={{ marginTop: 16 }}>
            {categoryOrder.map((label) => (
              <CategoryLink
                key={label}
                label={label}
                count={categoryCounts[label]}
                active={label === activeCategory}
                onClick={() => setActiveCategory(label)}
              />
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main style={styles.main}>
          <h1 style={styles.mainTitle}>The Journal</h1>
          <p style={styles.mainSubtitle}>
            A collection of thoughts on code, spatial data, running marathons,
            and the messy process of learning new things.
          </p>

          {/* FEATURED */}
          {(activeCategory === "All Posts" || activeCategory === "Tech & GIS") && (
            <>
              <article style={styles.featured}>
                <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14 }}>
                  <span style={styles.chip}>Tech & GIS</span>
                  <span style={{ fontSize:12, opacity:0.5, fontFamily:"'Inter', sans-serif" }}>
                    Oct 24, 2023 · 8 min read
                  </span>
                </div>

                <h2 style={styles.featuredTitle}>
                  Visualizing Large Scale Point Clouds with Potree & React
                </h2>

                <p style={styles.featuredText}>
                  When dealing with LiDAR datasets exceeding 50GB, standard browser
                  rendering techniques fall apart. In this experiment, I integrated
                  the Potree viewer into a modern React application to achieve
                  60fps rendering of 100M+ points.
                </p>

                <div style={styles.codeBlock}>
                  <span style={{ color:"#7df9ff" }}>
                    import {`{ useEffect, useRef }`} from "react";
                  </span>
                  <br />
                  <span style={{ color:"#f0a045" }}>const</span> initViewer =
                  {" (container) => {"}
                  <br />
                  &nbsp;&nbsp;viewer = new Potree.Viewer(container);
                  <br />
                  &nbsp;&nbsp;viewer.setEDLEnabled(true);
                  <br />
                  {"};"}
                </div>

                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:16 }}>
                  <span style={styles.techChip}>WebGL</span>
                  <span style={styles.techChip}>React</span>
                  <span style={styles.techChip}>GIS</span>
                </div>
              </article>

              <article style={styles.featured}>
                <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14 }}>
                  <span style={styles.chip}>Tech & GIS</span>
                  <span style={{ fontSize:12, opacity:0.5, fontFamily:"'Inter', sans-serif" }}>
                    Oct 28, 2023 · 7 min read
                  </span>
                </div>

                <h2 style={styles.featuredTitle}>
                  Groundwater Potential Zone Mapping with MIF + ROC Validation
                </h2>

                <p style={styles.featuredText}>
                  This study focuses on sustainable groundwater planning for semi-arid Pune, Maharashtra.
                  Using Remote Sensing and GIS with a Multi-Influencing Factor model, I combined eleven
                  thematic layers (lithology, geomorphology, slope, rainfall, land use, drainage density,
                  lineament density, soil, elevation, topographic wetness, and static water level) into a
                  weighted overlay to delineate groundwater potential zones. The model was validated with
                  ROC analysis (AUC 0.709), showing stronger potential in western Pune and a broad spread
                  of good-to-moderate zones.
                </p>

                <div style={styles.codeBlock}>
                  <span style={{ color:"#7df9ff" }}>MIF weights + GIS overlay</span>
                  <br />
                  <span style={{ color:"#f0a045" }}>ROC AUC</span> = 0.709
                  <br />
                  Western Pune → higher groundwater potential
                </div>

                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:16 }}>
                  <span style={styles.techChip}>Remote Sensing</span>
                  <span style={styles.techChip}>GIS</span>
                  <span style={styles.techChip}>Hydrogeology</span>
                </div>
              </article>
            </>
          )}

          {(activeCategory === "All Posts" || activeCategory === "Fitness & Health") && (
            <article style={styles.featured}>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14 }}>
                <span style={styles.chip}>Fitness & Health</span>
                <span style={{ fontSize:12, opacity:0.5, fontFamily:"'Inter', sans-serif" }}>
                  Oct 12, 2023 · 6 min read
                </span>
              </div>

              <h2 style={styles.featuredTitle}>
                How I Hit 100g Protein on a Vegetarian Diet (Without Fancy Stuff)
              </h2>

              <p style={styles.featuredText}>
                For a long time, I thought hitting 100g protein meant eating chicken or spending big
                money on supplements. Turns out, simple vegetarian Indian food is enough if planned
                right. Here is the routine that works for me and keeps cooking simple.
              </p>

              <div style={styles.codeBlock}>
                <span style={{ color:"#7df9ff" }}>My daily protein routine</span>
                <br />
                Morning: 30g pea/whey shake + banana pre-workout, another shake post-workout
                (~25g protein)
                <br />
                Lunch: 50g soya chunks, besan chilla, chapati, curd (~40g)
                <br />
                Dinner: 150g low-fat paneer, 2 chapatis, small protein scoop (~35-40g)
              </div>

              <p style={styles.featuredText}>
                Most Indian meals are carb heavy: rice, chapati, potatoes, and fried snacks. Protein
                ends up low, which leads to poor recovery, more cravings, easy fat gain, and that
                afternoon sleepiness. High carbs plus low protein gives poor body composition.
              </p>

              <p style={styles.featuredText}>
                The fix is not to remove carbs, but to balance them with protein. I prioritize
                protein-first meals with soya chunks, paneer, curd, dal, besan, and a basic shake.
                These keep me full longer, improve recovery, and help maintain lower body fat.
              </p>

              <p style={styles.featuredText}>
                Small swaps made a big difference. Consistency beats perfection.
              </p>

              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:16 }}>
                <span style={styles.techChip}>Nutrition</span>
                <span style={styles.techChip}>Vegetarian</span>
                <span style={styles.techChip}>Protein</span>
              </div>
            </article>
          )}

          {/* RECENT POSTS */}
          <section ref={recentPostsRef} style={{ marginTop:56, marginBottom:32 }}>
            <div style={styles.sectionHeader}>
              <h3 style={{ fontFamily:"'Rajdhani', sans-serif", fontSize:20, fontWeight:600, color:"#e8ddd0" }}>
                Recent Posts
              </h3>
              <span style={styles.link}>View Archive →</span>
            </div>

            <div style={styles.divider} />

            <div style={styles.postsGrid}>
              {filteredPosts.map((post) => (
                <PostCard key={post.title} {...post} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* ============================================================
   COMPONENTS
   ============================================================ */
function CategoryLink({ label, count, active, onClick }) {
  const [hover, setHover] = useState(false);
  const isActive = active || hover;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        padding:"8px 12px",
        borderRadius:8,
        background: isActive ? "rgba(240,160,69,0.1)" : "transparent",
        cursor:"pointer",
        transition:"all 0.2s ease",
        marginBottom:4,
      }}
    >
      <span style={{ fontSize:14, fontFamily:"'Inter', sans-serif", color: isActive ? "#e8ddd0" : "rgba(220,200,190,0.6)", transition:"color 0.2s ease" }}>
        {label}
      </span>
      <span style={{ fontSize:12, opacity:isActive ? 0.8 : 0.5, fontFamily:"'Rajdhani', sans-serif" }}>{count}</span>
    </div>
  );
}

function PostCard({ title, desc, date, read }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "rgba(240,160,69,0.06)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hover ? "rgba(240,160,69,0.25)" : "rgba(255,255,255,0.06)"}`,
        borderRadius:14,
        padding:"18px 20px",
        cursor:"pointer",
        transition:"all 0.3s ease",
        transform: hover ? "translateY(-3px)" : "none",
      }}
    >
      <h4 style={{ fontFamily:"'Rajdhani', sans-serif", fontSize:16, fontWeight:600, color: hover ? "#f0a045" : "#e8ddd0", transition:"color 0.3s ease", marginBottom:8 }}>
        {title}
      </h4>
      <p style={{ fontSize:13, opacity:0.5, lineHeight:1.6, marginBottom:10, fontFamily:"'Inter', sans-serif" }}>
        {desc}
      </p>
      <span style={{ fontSize:12, opacity:0.4, fontFamily:"'Inter', sans-serif" }}>
        {date} · {read}
      </span>
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
    // minHeight: "100vh",
    overflow: "auto",
    position: "relative",
    zIndex: 1,
    background:
      "radial-gradient(ellipse at 58% 0%, #1a1428 0%, transparent 55%), " +
      "radial-gradient(ellipse at 15% 80%, #151020 0%, transparent 50%), " +
      "#0d0a14",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "var(--journal-layout-cols, 260px 1fr)",
    gap: "var(--journal-layout-gap, 56px)",
    paddingTop: 24,
  },
  sidebar: {
    position: "var(--journal-sidebar-pos, sticky)",
    top: "var(--journal-sidebar-top, 0px)",
    height: "fit-content",
  },
  sidebarTitle: {
    color: "#f0a045",
    fontSize: 11,
    letterSpacing: 2,
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 600,
    textTransform: "uppercase",
  },
  newsletter: {
    marginTop: 32,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(240,160,69,0.14)",
    borderRadius: 14,
    padding: "20px 18px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    marginBottom: 10,
    outline: "none",
    transition: "border-color 0.2s ease",
  },
  btnPrimary: {
    width: "100%",
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(135deg, #f0a045, #d4944a)",
    color: "#0d0a14",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'Rajdhani', sans-serif",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
  main: {
    maxWidth: "var(--journal-main-max, 100%)",
  },
  mainTitle: {
    fontSize: "clamp(30px, 4vw, 36px)",
    fontWeight: 700,
    fontFamily: "'Rajdhani', sans-serif",
    color: "#e8ddd0",
    marginBottom: 12,
  },
  mainSubtitle: {
    opacity: 0.6,
    maxWidth: "var(--journal-sub-max, 700px)",
    lineHeight: 1.7,
    fontSize: 15,
    fontFamily: "'Inter', sans-serif",
    color: "#c8b8a8",
  },
  featured: {
    marginTop: 36,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(240,160,69,0.14)",
    borderRadius: 16,
    padding: "var(--journal-featured-pad, 28px 32px)",
  },
  chip: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
    background: "rgba(240,160,69,0.12)",
    color: "#f0a045",
    border: "1px solid rgba(240,160,69,0.25)",
    fontFamily: "'Rajdhani', sans-serif",
    letterSpacing: 0.5,
  },
  featuredTitle: {
    fontSize: "clamp(18px, 3vw, 22px)",
    fontWeight: 600,
    fontFamily: "'Rajdhani', sans-serif",
    color: "#e8ddd0",
    marginBottom: 14,
    lineHeight: 1.3,
  },
  featuredText: {
    opacity: 0.65,
    lineHeight: 1.7,
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    color: "#c8b8a8",
    marginBottom: 18,
  },
  codeBlock: {
    background: "rgba(0,0,0,0.4)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: "16px 18px",
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 1.6,
    color: "#c8b8a8",
  },
  techChip: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 6,
    fontSize: 11,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(220,200,190,0.7)",
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 500,
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  link: {
    color: "#f0a045",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 500,
    letterSpacing: 0.3,
    transition: "opacity 0.2s ease",
  },
  divider: {
    height: 1,
    background: "rgba(255,255,255,0.06)",
    marginBottom: 24,
  },
  postsGrid: {
    display: "grid",
    gridTemplateColumns: "var(--journal-posts-cols, 1fr 1fr)",
    gap: 18,
  },
};
