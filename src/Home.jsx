import React, { lazy } from "react";
import ScrollToTop from "./components/ScrollToTop";
import Hero from "./components/Hero";
import Process from "./components/Process";
import TrustedPartners from "./components/TrustedPartners";

import LazySection from "./components/LazySection";

// Lazy load heavy sections
const Feed = lazy(() => import("./pages/Feed"));
const Menu = lazy(() => import("./components/Menu"));
const Testimonial = lazy(() => import("./components/Testimonial"));
const GetApp = lazy(() => import("./components/GetApp"));
const Newsletter = lazy(() => import("./components/Newsletter"));
const Chat = lazy(() => import("./layouts/GeminiAssistant"));

const Home = () => {
  return (
    <>
      <ScrollToTop />

      {/* Above the fold */}
      <Hero />
      <Process />

      {/* Below the fold */}
      <LazySection height={400}>
        <Feed />
      </LazySection>

      <LazySection height={400}>
        <Menu />
      </LazySection>

      <LazySection height={300}>
        <Testimonial />
      </LazySection>

      <LazySection height={300}>
        <GetApp />
      </LazySection>

      <LazySection height={300}>
        <>
          <Newsletter />
          <Chat />
        </>
      </LazySection>

      <TrustedPartners />
    </>
  );
};

export default React.memo(Home);
