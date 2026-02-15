import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import PsLogo from "../Assects/LOGO.png";


/* ============================================================
   FONT + SCROLLBAR injection (runs once)
   ============================================================ */
(function bootstrap() {
  // Fonts
  if (!document.getElementById("__personal_fonts__")) {
    const f = document.createElement("link");
    f.id = "__personal_fonts__";
    f.rel = "stylesheet";
    f.href =
      "https://fonts.googleapis.com/css2?" +
      "family=Rajdhani:wght@300;400;500;600;700&" +
      "family=Inter:wght@300;400;500;600&" +
      "display=swap";
    document.head.appendChild(f);
  }
})();

export default function PersonalLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Determine active tab based on current path
  const getTabValue = () => {
    const path = location.pathname;
    if (path === "/personal" || path === "/personal/home") return 0;
    if (path === "/personal/journal") return 1;
    if (path === "/personal/fitness") return 2;
    if (path === "/personal/gallery") return 3;
    return 0;
  };

  const tabs = ["Home", "Journal", "Fitness", "Gallery"];
  const paths = ["/personal", "/personal/journal", "/personal/fitness", "/personal/gallery"];
  const disabledTabs = new Set(["Fitness"]);
  const activeTab = getTabValue();
  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div id="personal-container" className="personal-layout" style={styles.container}>
      {/* Navigation Header */}
      <div style={styles.header}>
        <img
          src={PsLogo}
          onClick={() => handleNavigate("/")}
          alt="Logo"
          style={styles.logo}
        />

        <button
          type="button"
          className="personal-menu-btn"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="personal-nav"
          style={styles.menuButton}
        >
          <span style={styles.menuIcon} />
          <span style={styles.menuIcon} />
          <span style={styles.menuIcon} />
        </button>

        <div
          id="personal-nav"
          className={`personal-tabs${menuOpen ? " is-open" : ""}`}
          style={styles.tabs}
        >
          {tabs.map((tab, i) => (
            <TabButton
              key={tab}
              active={activeTab === i}
              disabled={disabledTabs.has(tab)}
              onClick={() => handleNavigate(paths[i])}
            >
              {tab}
            </TabButton>
          ))}
        </div>
      </div>

      {/* Page Content */}
      <Outlet />
    </div>
  );
}

/* ============================================================
   TAB BUTTON
   ============================================================ */
function TabButton({ active, disabled, onClick, children }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}
      style={{
        background: disabled
          ? "rgba(255,255,255,0.02)"
          : active
            ? "rgba(240,160,69,0.12)"
            : hover
              ? "rgba(240,160,69,0.06)"
              : "transparent",
        color: disabled
          ? "rgba(220,200,190,0.35)"
          : active
            ? "#f0a045"
            : hover
              ? "#e8ddd0"
              : "rgba(220,200,190,0.6)",
        border: disabled
          ? "1px solid rgba(255,255,255,0.04)"
          : active
            ? "1px solid rgba(240,160,69,0.3)"
            : "1px solid transparent",
        padding: "var(--tab-pad, 8px 18px)",
        borderRadius: 8,
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: "var(--tab-font, 15px)",
        fontWeight: 600,
        cursor: disabled ? "default" : "pointer",
        transition: "all 0.25s ease",
        letterSpacing: 0.3,
        opacity: disabled ? 0.7 : 1,
        filter: disabled ? "blur(0.4px)" : "none",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

/* ============================================================
   STYLES
   ============================================================ */
const styles = {
  container: {
    backgroundColor: "#0d0a14",
    color: "#fff",
    height: "100%",
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    background:
      "radial-gradient(ellipse at 58% 0%, #1a1428 0%, transparent 55%), " +
      "radial-gradient(ellipse at 15% 80%, #151020 0%, transparent 50%), " +
      "#0d0a14",
  },
  header: {
    minHeight: "var(--header-h, 84px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    position: "var(--header-pos, static)",
    alignItems: "center",
    justifyContent: "var(--header-justify, space-between)",
    padding: "var(--header-pad-y, 0px) var(--personal-pad, 5%)",
    flexDirection: "var(--header-dir, row)",
    alignItems: "var(--header-align, center)",
    gap: "var(--header-gap, 0px)",
  },
  logo: {
    height: "var(--logo-h, 90px)",
    width: "auto",
    cursor: "pointer",
    transition: "opacity 0.2s ease",
  },
  tabs: {
    display: "var(--tabs-display, flex)",
    gap: "var(--tabs-gap, 12px)",
    flexWrap: "var(--tabs-wrap, nowrap)",
    overflowX: "var(--tabs-overflow, visible)",
    justifyContent: "var(--tabs-justify, flex-end)",
    width: "var(--tabs-width, auto)",
    WebkitOverflowScrolling: "touch",
    position: "var(--tabs-position, static)",
    top: "var(--tabs-top, auto)",
    left: "var(--tabs-left, auto)",
    right: "var(--tabs-right, auto)",
    background: "var(--tabs-bg, transparent)",
    padding: "var(--tabs-pad, 0)",
    border: "var(--tabs-border, none)",
    borderRadius: "var(--tabs-radius, 0)",
    boxShadow: "var(--tabs-shadow, none)",
    zIndex: 5,
  },
  menuButton: {
    display: "var(--menu-display, none)",
    position: "var(--menu-pos, static)",
    top: "var(--menu-top, auto)",
    right: "var(--menu-right, auto)",
    alignSelf: "var(--menu-align, auto)",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    width: 38,
    height: 36,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    cursor: "pointer",
    padding: 0,
  },
  menuIcon: {
    width: 18,
    height: 2,
    borderRadius: 2,
    background: "rgba(240,160,69,0.9)",
    display: "block",
  },
};
