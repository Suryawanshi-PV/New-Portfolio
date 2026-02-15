import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Box, Tabs, Tab, Container, Button } from "@mui/material";
import PsLogo from "../Assects/LOGO.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


/* ============================================================
   CUSTOM SCROLLBAR (Cyberpunk style)
   ============================================================ */
(function injectScrollbar() {
  if (!document.getElementById("__professional_scrollbar__")) {
    const s = document.createElement("style");
    s.id = "__professional_scrollbar__";
    s.textContent = `
      /* Webkit browsers (Chrome, Safari, Edge) */
      .zandu::-webkit-scrollbar {
        width: 12px;
      }
      .zandu::-webkit-scrollbar-track {
        background: rgba(11,15,26,0.5);
        border-left: 1px solid rgba(125,249,255,0.1);
      }
      .zandu::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, rgba(125,249,255,0.4), rgba(139,125,255,0.4));
        border-radius: 6px;
        border: 2px solid rgba(11,15,26,0.5);
      }
      .zandu::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, rgba(125,249,255,0.6), rgba(139,125,255,0.6));
      }
      
      /* Firefox */
      .zandu {
        scrollbar-width: thin;
        scrollbar-color: rgba(125,249,255,0.4) rgba(11,15,26,0.5);
      }
    `;
    document.head.appendChild(s);
  }
})();

export default function ProfessionalLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab based on current path
  const getTabValue = () => {
    const path = location.pathname;
    if (path === "/professional" || path === "/professional/overview") return 0;
    if (path === "/professional/projects") return 1;
    if (path === "/professional/resume") return 2;
    if (path === "/professional/contact") return 3;
    return 0;
  };

  const handleTabChange = (event, newValue) => {
    const paths = [
      "/professional",
      "/professional/projects",
      "/professional/resume",
      "/professional/contact",
    ];
    navigate(paths[newValue]);
  };



  return (
    <Box
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
      <Container style={{maxWidth:"unset",height:"100%",width:"100%"}} className="zandu" maxWidth="lg">

        {/* Navigation Tabs */}
        <Box
          sx={{
            height: "10%",
            borderBottom: 1,
            borderColor: "rgba(255,255,255,0.1)",
            mb: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          <Box
            component="img"
            src={PsLogo}
            onClick={()=>    navigate("/")}
            alt="Pavan Suryawanshi logo"
            sx={{ height: 90, width: "auto", display: "block" }}
          />

          <Tabs
            value={getTabValue()}
            onChange={handleTabChange}
            sx={{
              minHeight: 0,
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
            <Tab label="Overview" />
            <Tab label="Projects" />
            <Tab label="Resume" />
            <Tab label="Contact" />
          </Tabs>
        </Box>

        {/* Page Content */}
        <Outlet />
      </Container>
    </Box>
  );
}
