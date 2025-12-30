import React, { useState, useEffect } from "react";
import { Skeleton, Row, Col, Card } from "antd";
import Hero from "./components/Hero";
import Process from "./components/Process";
import Menu from "./components/Menu";
import Testimonial from "./components/Testimonial";
import GetApp from "./components/GetApp";
import Newsletter from "./components/Newsletter";
import Feed from "./pages/Feed" ;
import Chat from "./layouts/GeminiAssistant" ;
import TrustedPartners from "./components/TrustedPartners" ;
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

const Home = () => {
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
      <Hero />
      <Process /> 
      <LazyLoadOnView>
        <Feed/>
      </LazyLoadOnView>
      {/* Menu Skeleton */}
      <div className="px-5 lg:px-14 py-10">
        {menuLoading ? (
          <Row gutter={[16, 16]}>
            {[...Array(1)].map((_, idx) => (
              <Col xs={24} sm={12} md={12} lg={6} key={idx}>
                <Card>
                  <Skeleton.Image style={{ width: "100%", height: "100%" }} active />
                  <Skeleton active paragraph={{ rows: 4 }} />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Menu />
        )}
      </div>
       <Testimonial />
        <GetApp />
      <LazyLoadOnView>   
        <Newsletter />
        <Chat/>
      </LazyLoadOnView>
      <TrustedPartners/>
    </>
  );
};

export default Home; 
