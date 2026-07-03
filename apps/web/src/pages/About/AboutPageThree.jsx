import React from "react";
import { Layout } from "../../layouts/Layout";
import { AboutNine } from "../../components/About/AboutNine";
import { CtaAreaFive } from "../../components/CtaAreas/CtaAreaFive";
import { CounterAreaFour } from "../../components/CounterAreas/CounterAreaFour";
import { TeamAreaFour } from "../../components/TeamAreas/TeamAreaFour";
import { PricingAreaThree } from "../../components/PricingAreas/PricingAreaThree";

const AboutPageThree = () => {
  return (
    <Layout breadcrumb={"About"}  title={'About us'}>
      {/* about-area */}
      <AboutNine />

      {/* cta-area */}
      <CtaAreaFive />

      {/* counter-area */}
      <CounterAreaFour />

      {/* team-area */}
      <TeamAreaFour />

      {/* pricing-area */}
      <PricingAreaThree />
    </Layout>
  );
};

export default AboutPageThree;
