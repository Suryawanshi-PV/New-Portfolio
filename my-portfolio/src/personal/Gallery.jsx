import { useState, useEffect, useRef } from "react";
import gangPhoto from "../Assects/Gallery/jpg/Gang/gang1.jpg";
import gangPhoto1 from "../Assects/Gallery/jpg/Gang/gang3.jpg";
import gangPhoto2 from "../Assects/Gallery/jpg/Gang/gang5.jpg";
import gangPhoto3 from "../Assects/Gallery/jpg/Gang/gang2.JPG";
import gangPhoto4 from "../Assects/Gallery/jpg/Gang/gang4.jpg";
import gangPhoto6 from "../Assects/Gallery/jpg/Gang/gang6.JPG";
import gangPhoto5 from "../Assects/Gallery/jpg/Gang/gang7.jpg";
import gangPhoto7 from "../Assects/Gallery/jpg/Gang/gang8.JPG";
import gangPhoto8 from "../Assects/Gallery/jpg/Gang/gang-10.JPG";
import gangPhoto9 from "../Assects/Gallery/jpg/Gang/gang-11.JPG";
import gangPhoto10 from "../Assects/Gallery/jpg/Gang/Gav.jpg";
import gangPhoto11 from "../Assects/Gallery/jpg/Gang/Offic.jpg";
import lensOne from "../Assects/Gallery/jpg/through-my-lences/hampi1.jpg";
import lensTwo from "../Assects/Gallery/jpg/through-my-lences/AP4.jpg";
import lensThree from "../Assects/Gallery/jpg/through-my-lences/hyd.jpg";
import lensFour from "../Assects/Gallery/jpg/through-my-lences/goo.jpg";
import lensFive from "../Assects/Gallery/jpg/through-my-lences/me.jpg";
import lens6 from "../Assects/Gallery/jpg/through-my-lences/50rs.jpg";
import lens7 from "../Assects/Gallery/jpg/through-my-lences/Andra.jpg";
import lens8 from "../Assects/Gallery/jpg/through-my-lences/Gufa.jpg";
import lens9 from "../Assects/Gallery/jpg/through-my-lences/Home.jpg";
import lens10 from "../Assects/Gallery/jpg/through-my-lences/IMG_0531.jpg";
import lens11 from "../Assects/Gallery/jpg/through-my-lences/IMG_0537.jpg";
import lens12 from "../Assects/Gallery/jpg/through-my-lences/IMG_3659.jpg";
import lens13 from "../Assects/Gallery/jpg/through-my-lences/IMG_3665.jpg";
import lens14 from "../Assects/Gallery/jpg/through-my-lences/IMG_3674.jpg";
import lens15 from "../Assects/Gallery/jpg/through-my-lences/IMG_3722.jpg";
import lens16 from "../Assects/Gallery/jpg/through-my-lences/IMG_3779.jpg";
import lens17 from "../Assects/Gallery/jpg/through-my-lences/Mandi.jpg";
import lens18 from "../Assects/Gallery/jpg/through-my-lences/Temple.jpg";
import lens19 from "../Assects/Gallery/jpg/through-my-lences/Train.jpg";
import lens20 from "../Assects/Gallery/jpg/through-my-lences/Tree.jpg";
import hampi1 from "../Assects/Gallery/jpg/me-destinations/Hampi-1.jpg";
import hampi2 from "../Assects/Gallery/jpg/me-destinations/Hampi-2.jpg";
import goa1 from "../Assects/Gallery/jpg/me-destinations/GOA-1.jpg";
import goa2 from "../Assects/Gallery/jpg/me-destinations/GOA-2.jpg";
import goa3 from "../Assects/Gallery/jpg/me-destinations/GOA-3.jpg";
import goa4 from "../Assects/Gallery/jpg/me-destinations/GOA-4.jpg";
import andra1 from "../Assects/Gallery/jpg/me-destinations/Andra1.jpg";
import andra3 from "../Assects/Gallery/jpg/me-destinations/andra3.jpg";
import hyd1 from "../Assects/Gallery/jpg/me-destinations/Hyd-1.jpg";
import hyd2 from "../Assects/Gallery/jpg/me-destinations/Hyd-2.JPG";
import kalsubai1 from "../Assects/Gallery/jpg/me-destinations/Kalsubai-1.JPG";
import kalsubai2 from "../Assects/Gallery/jpg/me-destinations/Kalsubai-2.JPG";
import vizag1 from "../Assects/Gallery/jpg/me-destinations/Visakhapatnam-1.jpg";
import vizag2 from "../Assects/Gallery/jpg/me-destinations/Visakhapatnam-2.jpg";

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

/* ============================================================
   LIGHTBOX MODAL
   ============================================================ */
function Lightbox({ image, onClose }) {
  if (!image) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.95)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        cursor: "pointer",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
      <div style={{ position: "relative", maxWidth: "90%", maxHeight: "90%" }}>
        <img
          src={image}
          alt="Full screen view"
          style={{
            maxWidth: "100%",
            maxHeight: "85vh",
            objectFit: "contain",
            borderRadius: 8,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: -40,
            right: 0,
            background: "rgba(240,160,69,0.9)",
            border: "none",
            color: "#0d0a14",
            width: 36,
            height: 36,
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: 20,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#f0a045";
            e.target.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(240,160,69,0.9)";
            e.target.style.transform = "scale(1)";
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   CAROUSEL COMPONENT
   ============================================================ */
function Carousel({ images, autoRotate = true, interval = 5000, onImageClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!autoRotate || isHovered) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoRotate, interval, images.length, isHovered]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={() => onImageClick && onImageClick(images[currentIndex])}
    >
      {/* Images */}
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Slide ${idx + 1}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              opacity: idx === currentIndex ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
            }}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      {isHovered && images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(240,160,69,0.8)",
              border: "none",
              color: "#0d0a14",
              width: 36,
              height: 36,
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: 18,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#f0a045";
              e.target.style.transform = "translateY(-50%) scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(240,160,69,0.8)";
              e.target.style.transform = "translateY(-50%) scale(1)";
            }}
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(240,160,69,0.8)",
              border: "none",
              color: "#0d0a14",
              width: 36,
              height: 36,
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: 18,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#f0a045";
              e.target.style.transform = "translateY(-50%) scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(240,160,69,0.8)";
              e.target.style.transform = "translateY(-50%) scale(1)";
            }}
          >
            ›
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
            zIndex: 10,
          }}
        >
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(idx);
              }}
              style={{
                width: idx === currentIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                border: "none",
                background: idx === currentIndex ? "#f0a045" : "rgba(255,255,255,0.3)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      )}

      {/* Expand Icon */}
      {isHovered && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(240,160,69,0.8)",
            padding: "6px 10px",
            borderRadius: 6,
            fontSize: 12,
            color: "#0d0a14",
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 600,
            zIndex: 10,
          }}
        >
          Click to expand
        </div>
      )}
    </div>
  );
}

export default function Gallery() {
  const [lightboxImage, setLightboxImage] = useState(null);

  // Photo collections
  const lensPhotos = [lensOne, lensTwo, lensThree, lensFour,lensFive];
  const lensPhotosGroup1 = [lensOne, lensTwo, lensThree, lensFour, lensFive];
  const lensPhotosGroup2 = [lens6, lens7, lens8, lens9, lens10];
  const lensPhotosGroup3 = [lens11, lens12, lens13, lens14, lens15];
  const lensPhotosGroup4 = [lens16, lens17, lens18, lens19, lens20];
  const travelPhotoSets = {
    pune: [lensOne],
    south: [lensTwo],
    gang: [
      gangPhoto,
      gangPhoto1,
      gangPhoto2,
      gangPhoto3,
      gangPhoto4,
      gangPhoto5,
      gangPhoto6,
      gangPhoto7,
      gangPhoto8,
      gangPhoto9,
      gangPhoto10,
      gangPhoto11,
    ],
  };
  const destinationPhotos = [
    { id: 1, label: "Hampi", images: [hampi1, hampi2] },
    { id: 2, label: "Goa", images: [goa1, goa2, goa3, goa4] },
    { id: 3, label: "Andhra", images: [andra1, andra3] },
    { id: 4, label: "Hyderabad", images: [hyd1, hyd2] },
    { id: 5, label: "Kalsubai", images: [kalsubai1, kalsubai2] },
    { id: 6, label: "Visakhapatnam", images: [vizag1, vizag2] },
  ];

  return (
    <div style={styles.page}>
      <style>
        {`
          @keyframes slideIn {
            from { transform: scaleX(0); opacity: 0; }
            to { transform: scaleX(1); opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
      <Grain />
      <AmbientParticles />
      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />

      {/* HERO */}
      <section style={styles.hero}>
        <span style={styles.tag}>OFF THE KEYBOARD</span>
        <h1 style={styles.heroTitle}>
          Exploring the world,<br />
          one coordinate at a time.
        </h1>
        <p style={styles.heroText}>
          When I'm not configuring GeoServers or debugging React apps, you'll
          find me trekking in the Sahyadris, experimenting with coffee brewing,
          or getting lost in a good book.
        </p>
      </section>

      {/* TYPICAL DAY */}
      <section style={styles.section}>
        <SectionHeader title="A Typical Day" right="Based on last 30 days" />
        <div style={styles.dayGrid}>
          <DayCard time="06:30 AM" title="Morning Ritual" desc="Ginger chai, meditation, and reading. No screens for first 30 mins." />
          <DayCard time="09:00 AM" title="Deep Work" desc="Core development tasks. Focus mode on. Lo-fi beats playing." />
          <DayCard time="01:00 PM" title="Ghar Ka Khana" desc="Homemade lunch. Reset the brain." />
          <DayCard time="06:00 PM" title="Physical Grind" desc="Gym or run. Switching context from mental to physical stress." />
          <DayCard time="09:00 PM" title="Learning & Leisure" desc="Side projects, reading fiction, or gaming. Wind down." />
        </div>
      </section>

      {/* TRAVEL LOG */}
      <section style={styles.section}>
        <SectionHeader title="Experience Trails" right="View All Journeys →" />
        <div style={styles.travelGrid}>
              <TravelCard 
            title="Comrades in Adventure" 
            images={travelPhotoSets.gang}
            onImageClick={setLightboxImage}
          />
          <TravelCard 
            title="Pune & Sahyadri" 
            images={travelPhotoSets.pune}
            comingSoon={true}
            onImageClick={setLightboxImage}
          />
          <TravelCard 
            title="South India" 
            images={travelPhotoSets.south}
            comingSoon={true}
            onImageClick={setLightboxImage}
          />
      
        </div>
      </section>

      {/* ME ACROSS DESTINATIONS */}
      <section style={styles.section}>
        <SectionHeader title="Me, Across Destinations" right="5 Destinations" />
        <div style={styles.destinationGrid}>
          {destinationPhotos.map((destination) => (
            <DestinationCard
              key={destination.id}
              label={destination.label}
              images={destination.images}
              onImageClick={setLightboxImage}
            />
          ))}
        </div>
      </section>

      {/* READING + QUOTE */}
      <section style={styles.twoCol}>
        <div>
          <SectionHeader title="Currently Reading" />
          <ReadingCard title="The Almanack of Naval Ravikant" author="Eric Jorgenson" tag="Philosophy" />
          <ReadingCard title="Designing Data-Intensive Applications" author="Martin Kleppmann" tag="Tech" />
          <ReadingCard title="Dark Matter" author="Blake Crouch" tag="Sci-Fi" />
        </div>

        <div style={styles.quoteCard}>
          <p style={styles.quoteMark}>"</p>
          <p style={styles.quoteText}>
            We have two lives, and the second one begins when we realize we only have one.
          </p>
          <span style={styles.quoteAuthor}>— Confucius</span>

          <div style={{ marginTop: 20 }}>
            <strong style={{ fontFamily:"'Rajdhani', sans-serif", color:"#e8ddd0" }}>Latest Musing</strong>
            <p style={{ opacity: 0.5, fontSize: 13, marginTop:6, fontFamily:"'Inter', sans-serif", lineHeight:1.6 }}>
              Trying to find the balance between shipping code fast and building
              sustainable systems. It applies to software architecture as much
              as it does to personal habits.
            </p>
          </div>
        </div>
      </section>

      {/* THROUGH MY LENS - Enhanced with Carousel */}
      <section style={styles.section}>
        <SectionHeader title="Through My Lens" />
        <div style={styles.lensGridUpdated}>
          <div style={styles.lensCard}>
            <Carousel 
              images={lensPhotosGroup1} 
              autoRotate={true}
              interval={5000}
              onImageClick={setLightboxImage}
            />
          </div>
          <div style={styles.lensCard}>
            <Carousel 
              images={lensPhotosGroup2} 
              autoRotate={true}
              interval={5500}
              onImageClick={setLightboxImage}
            />
          </div>
          <div style={styles.lensCard}>
            <Carousel 
              images={lensPhotosGroup3} 
              autoRotate={true}
              interval={6000}
              onImageClick={setLightboxImage}
            />
          </div>
          <div style={styles.lensCard}>
            <Carousel 
              images={lensPhotosGroup4} 
              autoRotate={true}
              interval={6500}
              onImageClick={setLightboxImage}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   COMPONENTS
   ============================================================ */
function SectionHeader({ title, right }) {
  return (
    <div style={styles.sectionHeader}>
      <h3 style={{ fontFamily:"'Rajdhani', sans-serif", fontSize:20, fontWeight:600, color:"#e8ddd0" }}>
        {title}
      </h3>
      {right && <span style={styles.link}>{right}</span>}
    </div>
  );
}

function DayCard({ time, title, desc }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "rgba(240,160,69,0.07)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hover ? "rgba(240,160,69,0.25)" : "rgba(255,255,255,0.07)"}`,
        padding: 20,
        borderRadius: 14,
        transition: "all 0.3s ease",
        transform: hover ? "translateY(-3px)" : "none",
      }}
    >
      <span style={{ fontSize:12, color:"#f0a045", fontFamily:"'Rajdhani', sans-serif", fontWeight:600 }}>
        {time}
      </span>
      <strong style={{ display:"block", marginTop:8, fontFamily:"'Rajdhani', sans-serif", fontSize:15, color:"#e8ddd0" }}>
        {title}
      </strong>
      <p style={{ fontSize:13, opacity:0.5, marginTop:4, fontFamily:"'Inter', sans-serif", lineHeight:1.6 }}>
        {desc}
      </p>
    </div>
  );
}

function TravelCard({ title, images, onImageClick, comingSoon = false }) {
  const [hover, setHover] = useState(false);
  const hasImages = Array.isArray(images) && images.length > 0;
  const showImages = hasImages && !comingSoon;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: comingSoon
          ? "rgba(66,118,216,0.08)"
          : hover
            ? "rgba(240,160,69,0.06)"
            : "rgba(255,255,255,0.03)",
        border: `1px solid ${comingSoon ? "rgba(66,118,216,0.35)" : hover ? "rgba(240,160,69,0.25)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 14,
        padding: 14,
        transition: "all 0.3s ease",
        boxShadow: comingSoon ? "0 6px 14px rgba(66,118,216,0.10)" : "none",
        opacity: comingSoon ? 0.5 : 1,
        filter: comingSoon ? "blur(1px)" : "none",
      }}
    >
      <div style={styles.imgPlaceholder}>
        {showImages ? (
          <Carousel 
            images={images} 
            autoRotate={true}
            interval={5000}
            onImageClick={onImageClick}
          />
        ) : (
          <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(145deg, rgba(38,72,133,0.45), rgba(21,44,84,0.6))",
          }}>
          </div>
        )}
      </div>
      {!comingSoon && (
        <>
          <strong style={{ display:"block", marginTop:10, fontFamily:"'Rajdhani', sans-serif", fontSize:15, color:"#e8ddd0" }}>
            {title}
          </strong>
          <p style={{ fontSize:13, opacity:0.5, marginTop:4, fontFamily:"'Inter', sans-serif" }}>
            A short story from the road.
          </p>
        </>
      )}
    </div>
  );
}

function DestinationCard({ label, images, onImageClick }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        overflow: "hidden",
        padding: 12,
        transition: "all 0.3s ease",
      }}
    >
      {/* Carousel */}
      <div style={{
        width: "100%",
        height: 240,
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 10,
      }}>
        <Carousel
          images={images}
          autoRotate={true}
          interval={5000}
          onImageClick={onImageClick}
        />
      </div>
      
      {/* Destination Label */}
      <div>
        <h4 style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 15,
          fontWeight: 600,
          color: "#e8ddd0",
          margin: "8px 0 4px",
        }}>
          {label}
        </h4>
        <p style={{
          fontSize: 12,
          opacity: 0.5,
          margin: 0,
          fontFamily: "'Inter', sans-serif",
          color: "#c8b8a8",
        }}>
          {images.length} photo{images.length > 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}

function LocationCard({ image, label, onImageClick, heightVariation = 0 }) {
  const [hover, setHover] = useState(false);
  
  // Staggered heights for visual flow
  const heights = [280, 320, 260, 300, 270];
  const cardHeight = heights[heightVariation % heights.length];
  
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onImageClick && onImageClick(image)}
      style={{
        position: "relative",
        height: cardHeight,
        borderRadius: 20,
        overflow: "hidden",
        cursor: "pointer",
        border: "1px solid rgba(255,255,255,0.25)",
        transition: "all 0.5s ease",
        transform: hover ? "translateY(-12px)" : "none",
        backdropFilter: hover ? "blur(10px)" : "blur(3px)",
        background: hover
          ? "rgba(255,255,255,0.12)"
          : "rgba(255,255,255,0.08)",
        boxShadow: hover
          ? "0 8px 32px rgba(31, 38, 135, 0.37), inset 0 0 1px rgba(255,255,255,0.2)"
          : "0 4px 15px rgba(0,0,0,0.1)",
      }}
    >
      {/* Background Image with Overlay */}
      <div style={{ position: "absolute", inset: 0 }}>
        <img
          src={image}
          alt={label}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
            transform: hover ? "scale(1.1)" : "scale(1)",
          }}
        />
        
        {/* Glassmorphism Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: hover
              ? "linear-gradient(135deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.4) 100%)"
              : "linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)",
            backdropFilter: "blur(8px)",
            transition: "all 0.5s ease",
          }}
        />
      </div>
      
      {/* Location Info Container */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "20px",
          background: "linear-gradient(to top, rgba(13,10,20,0.9), rgba(13,10,20,0.4), transparent)",
          color: "#e8ddd0",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ 
            fontSize: 18,
            transition: "transform 0.3s ease",
            transform: hover ? "scale(1.2) rotate(20deg)" : "scale(1) rotate(0deg)",
          }}>
            📍
          </span>
          <h3 style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 18,
            fontWeight: 600,
            margin: 0,
            letterSpacing: 0.5,
          }}>
            {label}
          </h3>
        </div>
      </div>
      
      {/* Glassmorphic Top Accent Bar */}
      {hover && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(90deg, #f0a045, #e8ddd0, #f0a045)",
            animation: "slideIn 0.5s ease",
          }}
        />
      )}

      {/* View Indicator */}
      {hover && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(240,160,69,0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#0d0a14",
            padding: "8px 12px",
            borderRadius: 8,
            fontSize: 12,
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 600,
            animation: "fadeIn 0.3s ease",
            boxShadow: "0 4px 15px rgba(240,160,69,0.2)",
          }}
        >
          View
        </div>
      )}
    </div>
  );
}

function ReadingCard({ title, author, tag }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display:"flex", gap:14,
        background: hover ? "rgba(240,160,69,0.06)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hover ? "rgba(240,160,69,0.25)" : "rgba(255,255,255,0.06)"}`,
        padding:"14px 16px",
        borderRadius:12,
        marginBottom:12,
        transition:"all 0.3s ease",
        cursor: "pointer",
      }}
    >
      <div style={styles.bookImg} />
      <div style={{ flex:1 }}>
        <strong style={{ fontFamily:"'Rajdhani', sans-serif", fontSize:14, color:"#e8ddd0" }}>
          {title}
        </strong>
        <p style={{ opacity:0.5, fontSize:13, marginTop:3, fontFamily:"'Inter', sans-serif" }}>
          {author}
        </p>
        <span style={{
          display:"inline-block", marginTop:6, fontSize:11,
          padding:"2px 10px", borderRadius:6,
          border:"1px solid rgba(240,160,69,0.25)",
          color:"#f0a045",
          fontFamily:"'Rajdhani', sans-serif",
          fontWeight:600,
        }}>
          {tag}
        </span>
      </div>
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
  hero: {
    maxWidth: 720,
    marginBottom: 80,
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
  section: {
    marginBottom: 90,
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
  dayGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 18,
  },
  travelGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
  },
  destinationGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 18,
  },
  destinationCard: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 10,
  },
  destinationImg: {
    width: "100%",
    height: 200,
    objectFit: "cover",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)",
  },
  destinationMedia: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  destinationPlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    border: "1px dashed rgba(240,160,69,0.35)",
    background: "rgba(240,160,69,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  destinationText: {
    fontSize: 12,
    color: "#f0a045",
    letterSpacing: 1,
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 600,
  },
  destinationCaption: {
    fontSize: 12,
    opacity: 0.6,
    fontFamily: "'Inter', sans-serif",
    color: "#c8b8a8",
  },
  imgPlaceholder: {
    width: "100%",
    height: 210,
    borderRadius: 12,
    overflow: "hidden",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 40,
    marginBottom: 90,
  },
  bookImg: {
    width: 48,
    height: 64,
    borderRadius: 6,
    background: "linear-gradient(135deg, rgba(240,160,69,0.08), rgba(167,139,250,0.05))",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  quoteCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(240,160,69,0.14)",
    borderRadius: 14,
    padding: "26px 24px",
  },
  quoteMark: {
    fontSize: 32,
    color: "#f0a045",
    lineHeight: 1,
    marginBottom: 8,
    fontFamily: "'Rajdhani', sans-serif",
  },
  quoteText: {
    fontStyle: "italic",
    lineHeight: 1.7,
    marginBottom: 10,
    fontSize: 15,
    opacity: 0.7,
    fontFamily: "'Inter', sans-serif",
    color: "#c8b8a8",
  },
  quoteAuthor: {
    opacity: 0.5,
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
  },
  lensGrid: {
    display: "grid",
    gridTemplateColumns: "2.2fr 1.3fr",
    gap: 24,
  },
  lensLarge: {
    height: 440,
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  lensSmallGrid: {
    display: "grid",
    gridTemplateRows: "1.2fr 1.2fr 1.6fr",
    gap: 16,
  },
  lensSmall: {
    height: 190,
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  lensSmallWide: {
    height: 240,
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  lensGridUpdated: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 20,
  },
  lensCard: {
    height: 380,
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
  },
};