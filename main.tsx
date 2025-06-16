import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "../../styles/language-toggle-fix.css";

// Set document title and meta tags
document.title = "Family Business Compass Assessment | เข็มทิศธุรกิจครอบครัว";

// Add meta description
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'Discover your family business strengths across 4 critical dimensions: Governance, Legacy, Relationships, and Entrepreneurship. ค้นพบจุดแข็งของธุรกิจครอบครัวใน 4 มิติสำคัญ';
document.head.appendChild(metaDescription);

// Add Open Graph tags
const ogTitle = document.createElement('meta');
ogTitle.property = 'og:title';
ogTitle.content = 'Family Business Compass Assessment';
document.head.appendChild(ogTitle);

const ogDescription = document.createElement('meta');
ogDescription.property = 'og:description';
ogDescription.content = 'Professional assessment tool for family businesses to evaluate governance, legacy, relationships, and entrepreneurship capabilities.';
document.head.appendChild(ogDescription);

const ogType = document.createElement('meta');
ogType.property = 'og:type';
ogType.content = 'website';
document.head.appendChild(ogType);

createRoot(document.getElementById("root")!).render(<App />);
