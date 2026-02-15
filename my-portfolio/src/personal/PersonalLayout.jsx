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
  
  // Custom Scrollbar (Warm Amber style)
  if (!document.getElementById("__personal_scrollbar__")) {
    const s = document.createElement("style");
    s.id = "__personal_scrollbar__";
    s.textContent = `
      /* Webkit browsers (Chrome, Safari, Edge) */
      #personal-container::-webkit-scrollbar {
        width: 12px;
      }
      #personal-container::-webkit-scrollbar-track {
        background: rgba(13,10,20,0.5);
        border-left: 1px solid rgba(240,160,69,0.1);
      }
      #personal-container::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, rgba(240,160,69,0.5), rgba(240,160,69,0.3));
        border-radius: 6px;
        border: 2px solid rgba(13,10,20,0.5);
      }
      #personal-container::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, rgba(240,160,69,0.7), rgba(240,160,69,0.5));
      }
      
      /* Firefox */
      #personal-container {
        scrollbar-width: thin;
        scrollbar-color: rgba(240,160,69,0.5) rgba(13,10,20,0.5);
      }
    `;
    document.head.appendChild(s);
  }
})();

export default function PersonalLayout() {
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <div id="personal-container" style={styles.container}>
      {/* Navigation Header */}
      <div style={styles.header}>
        <img
          src={PsLogo}
          onClick={() => navigate("/")}
          alt="Logo"
          style={styles.logo}
        />

        <div style={styles.tabs}>
          {tabs.map((tab, i) => (
            <TabButton
              key={tab}
              active={activeTab === i}
              disabled={disabledTabs.has(tab)}
              onClick={() => navigate(paths[i])}
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
        padding: "8px 18px",
        borderRadius: 8,
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: 15,
        fontWeight: 600,
        cursor: disabled ? "default" : "pointer",
        transition: "all 0.25s ease",
        letterSpacing: 0.3,
        opacity: disabled ? 0.7 : 1,
        filter: disabled ? "blur(0.4px)" : "none",
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
    width: "100%",
    display: "flex",
    flexDirection: "column",
    background:
      "radial-gradient(ellipse at 58% 0%, #1a1428 0%, transparent 55%), " +
      "radial-gradient(ellipse at 15% 80%, #151020 0%, transparent 50%), " +
      "#0d0a14",
  },
  header: {
    height: "10%",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 5%",
  },
  logo: {
    height: 90,
    width: "auto",
    cursor: "pointer",
    transition: "opacity 0.2s ease",
  },
  tabs: {
    display: "flex",
    gap: 12,
  },
};
