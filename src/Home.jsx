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
      <Chat />
      {/* Below the fold */}
      <LazySection height={400}>
        <Feed />
      </LazySection>
      <Menu />
      <LazySection height={300}>
        <Testimonial />
      </LazySection>
      <GetApp />
      <Newsletter />
      <TrustedPartners />
    </>
  );
};

export default React.memo(Home);
