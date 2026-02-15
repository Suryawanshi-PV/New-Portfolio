import { Box, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function EntryCard({
  title,
  description,
  accentColor,
  onClick,
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        height: 220,
        p: 4,
        borderRadius: 3,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.15)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          borderColor: accentColor,
          boxShadow: `0 0 25px ${accentColor}55`,
        },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h5" fontWeight={600} sx={{ color: accentColor }}>
        {title}
      </Typography>
      <Box>
        <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
          {description}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: accentColor }}>
          <span>Explore</span>
          <ArrowForwardIcon sx={{ fontSize: 18 }} />
        </Box>
      </Box>
    </Box>
  );
}
