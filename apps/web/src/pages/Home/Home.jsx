import React, { useState, useEffect, useCallback } from "react";
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
import { ErrorNotice } from "../../components/common/ErrorNotice";

const Home = () => {
  const [config, setConfig] = useState(null);
  const [configLoaded, setConfigLoaded] = useState(false);
  // The config only decides which sections are shown; if it cannot be read the
  // page still renders every section with its defaults, and the failure is
  // reported rather than leaving an admin wondering why their toggles did
  // nothing.
  const [configError, setConfigError] = useState(null);

  const loadConfig = useCallback(() => {
    setConfigLoaded(false);
    setConfigError(null);
    api.getHomepageConfig()
      .then((data) => {
        if (data && Object.keys(data).length > 0) setConfig(data);
      })
      .catch((err) => setConfigError(err))
      .finally(() => setConfigLoaded(true));
  }, []);

  useEffect(() => { loadConfig(); }, [loadConfig]);

  return (
    <Layout header={1} footer={1} transparentHeader>
      <HeroSection config={config} configLoaded={configLoaded} />

      {configError && (
        <div className="container" style={{ maxWidth: "720px", padding: "24px 16px 0" }}>
          <ErrorNotice
            error={configError}
            title="Homepage settings could not be loaded"
            onRetry={loadConfig}
            tone="warning"
            compact
          />
        </div>
      )}

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
