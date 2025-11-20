import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Skeleton, Row, Col, Card } from "antd";
import Navbar from "./components/Navbar";
// import Hero from "./components/Hero";
import Process from "./components/Process";
import Menu from "./components/Menu";
import Testimonial from "./components/Testimonial";
import GetApp from "./components/GetApp";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
//import GeminiAssistant from "./layouts/GeminiAssistant" 
// Lazy loading wrapper
import { lazy, Suspense } from "react";

// ⬇️ Lazy loaded pages
const Policy = lazy(() => import("./pages/Policy"));
const Terms = lazy(() => import("./pages/Terms"));
const SmallProjects = lazy(() => import("./pages/SmallProjects"));
const LargeProjects = lazy(() => import("./pages/LargeProjects"));
const ServerAPI = lazy(() => import("./pages/ServerAPI"));

// Example Home (Optional: Replace with your real one)
const Home = lazy(() => import("./components/Hero"));

// ⬇️ SVG Loader Component
const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#0B0E17" stroke="#00FFEA" stroke-width="3"/>
  <circle cx="100" cy="100" r="20" fill="#00FFEA">
    <animate attributeName="r" values="20;28;20" dur="1.8s" repeatCount="indefinite"/>
  </circle>
  <path d="M100 100 Q70 70 70 100 Q70 130 100 130" fill="none" stroke="#00FFEA" stroke-width="8">
    <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>
  </path>
  <path d="M100 100 Q130 70 130 100 Q130 130 100 130" fill="none" stroke="#00FFEA" stroke-width="8">
    <animate attributeName="opacity" values="0;1;0" dur="2s" begin="0.5s" repeatCount="indefinite"/>
  </path>
</svg>
    <p className="text-gray-500 mt-3">Loading page...</p>
  </div>
);
const LazyLoadOnView = ({ children }) => {
  const ref = React.useRef();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  return <div ref={ref}>{isVisible ? children : null}</div>;
};

const App = () => {
  const [navbarLoading, setNavbarLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(true);

  useEffect(() => {
    const navbarTimer = setTimeout(() => setNavbarLoading(false), 3000);
    const menuTimer = setTimeout(() => setMenuLoading(false), 3000);

    return () => {
      clearTimeout(navbarTimer);
      clearTimeout(menuTimer);
    };
  }, []);

  return (
    <>
<Router>
      {/* Suspense wraps everything to show loader while components load */}
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* MAIN ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/small-projects" element={<SmallProjects />} />
          <Route path="/large-projects" element={<LargeProjects />} />
          <Route path="/server-api" element={<ServerAPI />} />

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-3">404</h1>
                <p className="text-gray-600">Page not found</p>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </Router>
      
      {/* Navbar Skeleton */}
      {navbarLoading ? <Skeleton active paragraph={false} style={{ width: "100%", height: 200 }}/> : 
      <Router>
      <Navbar />
    </Router>
      
      }

      <LazyLoadOnView>
        {/*   <Hero />*/} 
        <Process />
      </LazyLoadOnView>

      {/* Menu Skeleton */}
      <div className="px-5 lg:px-14 py-10">
        {menuLoading ? (
          <Row gutter={[16, 16]}>
            {[...Array(4)].map((_, idx) => (
              <Col xs={24} sm={12} md={12} lg={6} key={idx}>
                <Card>
                  <Skeleton.Image style={{ width: "100%", height: 150 }} active />
                  <Skeleton active paragraph={{ rows: 2 }} />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Menu />
        )}
      </div>

      <LazyLoadOnView>
        <Testimonial />
        <GetApp />
        <Newsletter />
        
      </LazyLoadOnView>

      <Footer />
    </>
  );
};

export default App;

