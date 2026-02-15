import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Box, Tabs, Tab, Container, Button } from "@mui/material";
import PsLogo from "../Assects/LOGO.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ProfessionalLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Determine active tab based on current path
  const getTabValue = () => {
    const path = location.pathname;
    if (path === "/professional" || path === "/professional/overview") return 0;
    if (path === "/professional/projects") return 1;
    if (path === "/professional/resume") return 2;
    if (path === "/professional/contact") return 3;
    return 0;
  };

  const tabs = ["Overview", "Projects", "Resume", "Contact"];
  const paths = [
    "/professional",
    "/professional/projects",
    "/professional/resume",
    "/professional/contact",
  ];

  const handleTabChange = (event, newValue) => {
    navigate(paths[newValue]);
    setMenuOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };



  return (
    <Box
      className="professional-layout"
      sx={{
        // minHeight: "100vh",
        bgcolor: "#0b0f1a",
        color: "#fff",
        py: 4,
        height: "100%",
        width: "100%",
        paddingTop: 0,
      }}
    >
      <Container style={{ maxWidth: "unset", height: "100%", width: "100%" }} maxWidth="lg">

        {/* Navigation Tabs */}
        <Box
          className="professional-header"
          sx={{
            height: "10%",
            borderBottom: 1,
            borderColor: "rgba(255,255,255,0.1)",
            mb: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
            position: "var(--prof-header-pos, static)",
          }}
        >
          <Box
            component="img"
            src={PsLogo}
            onClick={() => handleNavigate("/")}
            alt="Pavan Suryawanshi logo"
            sx={{ height: 90, width: "auto", display: "block" }}
          />

          <button
            type="button"
            className="professional-menu-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="professional-nav"
            style={{
              display: "var(--prof-menu-display, none)",
              position: "var(--prof-menu-pos, static)",
              top: "var(--prof-menu-top, auto)",
              right: "var(--prof-menu-right, auto)",
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
            }}
          >
            <span style={{ width: 18, height: 2, borderRadius: 2, background: "rgba(125,249,255,0.9)", display: "block" }} />
            <span style={{ width: 18, height: 2, borderRadius: 2, background: "rgba(125,249,255,0.9)", display: "block" }} />
            <span style={{ width: 18, height: 2, borderRadius: 2, background: "rgba(125,249,255,0.9)", display: "block" }} />
          </button>

          <Tabs
            id="professional-nav"
            className={`professional-tabs${menuOpen ? " is-open" : ""}`}
            value={getTabValue()}
            onChange={handleTabChange}
            sx={{
              minHeight: 0,
              display: "var(--prof-tabs-display, flex)",
              "& .MuiTab-root": {
                color: "rgba(255,255,255,0.7)",
                textTransform: "none",
                fontSize: "1rem",
                minHeight: 0,
                paddingY: 1,
                "&.Mui-selected": {
                  color: "#7df9ff",
                },
              },
              "& .MuiTabs-flexContainer": {
                gap: 1,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#7df9ff",
              },
            }}
          >
            {tabs.map((tab) => (
              <Tab key={tab} label={tab} />
            ))}
          </Tabs>

          <Box
            className={`professional-menu${menuOpen ? " is-open" : ""}`}
            sx={{
              display: "var(--prof-menu-panel-display, none)",
              flexDirection: "column",
              gap: 1,
              position: "var(--prof-menu-panel-pos, absolute)",
              top: "var(--prof-menu-panel-top, auto)",
              left: "var(--prof-menu-panel-left, 0px)",
              right: "var(--prof-menu-panel-right, 0px)",
              bgcolor: "rgba(11,15,26,0.98)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 2,
              padding: 1.5,
              boxShadow: "0 12px 30px rgba(0, 0, 0, 0.35)",
              zIndex: 5,
            }}
          >
            {tabs.map((tab, i) => (
              <Button
                key={tab}
                onClick={() => handleNavigate(paths[i])}
                sx={{
                  justifyContent: "flex-start",
                  color: getTabValue() === i ? "#7df9ff" : "rgba(255,255,255,0.75)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  textTransform: "none",
                  fontSize: "0.95rem",
                  paddingY: 0.75,
                }}
              >
                {tab}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Page Content */}
        <Outlet />
      </Container>
    </Box>
  );
}
