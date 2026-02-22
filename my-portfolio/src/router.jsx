import { createHashRouter } from "react-router-dom";
import Landing from "./landing/Landing";
import ProfessionalLayout from "./professional/ProfessionalLayout";
import Overview from "./professional/Overview";
import Projects from "./professional/Projects";
import Resume from "./professional/Resume";
import Contact from "./professional/Contact";
import PersonalLayout from "./personal/PersonalLayout";
import Home from "./personal/Home";
import Journal from "./personal/Journal";
import Fitness from "./personal/Fitness";
import Gallery from "./personal/Gallery";

export const router = createHashRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/professional",
    element: <ProfessionalLayout />,
    children: [
      { index: true, element: <Overview /> },
      { path: "overview", element: <Overview /> },
      { path: "projects", element: <Projects /> },
      { path: "resume", element: <Resume /> },
      { path: "contact", element: <Contact /> },
    ],
  },
  {
    path: "/personal",
    element: <PersonalLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "journal", element: <Journal /> },
      { path: "fitness", element: <Fitness /> },
      { path: "gallery", element: <Gallery /> },
    ],
  },
]);
