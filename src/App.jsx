import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Process from "./components/Process";
import Menu from "./components/Menu";
import Testimonial from "./components/Testimonial";
import GetApp from "./components/GetApp";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

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
  return (
    <>
      <Navbar />
      <Hero />
      <Process />
      <Menu />
      

      {/* Lazy load Testimonial when visible */}
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
