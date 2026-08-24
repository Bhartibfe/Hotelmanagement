import React, { useState, useEffect } from "react";
import { HeroSection } from "../../components/home/HeroSection";
import { NetworkStatsSection } from "../../components/home/NetworkStatsSection";
import { FeaturedVendorsSection } from "../../components/home/FeaturedVendorsSection";
import { FeaturedExpertsSection } from "../../components/home/FeaturedExpertsSection";
import { EventsPreview } from "../../components/home/EventsPreview";
import { TestimonialsSection } from "../../components/home/TestimonialsSection";
import { JoinNetworkCTA } from "../../components/home/JoinNetworkCTA";
import { BrandTwo } from "../../components/Brand/BrandTwo";
import { Layout } from "../../layouts/Layout";
import api from "../../services/api";

const Home = () => {
  const [config, setConfig] = useState(null);
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    api.getHomepageConfig()
      .then((data) => {
        if (data && Object.keys(data).length > 0) setConfig(data);
      })
      .catch(() => {})
      .finally(() => setConfigLoaded(true));
  }, []);

  return (
    <Layout header={1} footer={1} transparentHeader>
      <HeroSection config={config} configLoaded={configLoaded} />

      {/* Sections wait for the config so none of them render and then vanish */}
      {configLoaded && (
        <>
          {config?.showStats !== false && <NetworkStatsSection config={config} />}

          {config?.showFeaturedExperts !== false && <FeaturedExpertsSection config={config} />}

          {config?.showFeaturedVendors !== false && <FeaturedVendorsSection config={config} />}

          {config?.showEvents !== false && <EventsPreview config={config} />}

          {config?.showTestimonials !== false && <TestimonialsSection config={config} />}

          {config?.showCta !== false && <JoinNetworkCTA config={config} />}
        </>
      )}
    </Layout>
  );
};

export default Home;
