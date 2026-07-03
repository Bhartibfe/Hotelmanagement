import React from "react";
import { Layout } from "../../layouts/Layout";
import { AboutTen } from "../../components/About/AboutTen";
import { FeatureSix } from "../../components/Features/FeatureSix";
import { FeatureSeven } from "../../components/Features/FeatureSeven";
import { TeamAreaTwo } from "../../components/TeamAreas/TeamAreaTwo";
import { RequestAreaTwo } from "../../components/RequestAreas/RequestAreaTwo";
import { BrandSix } from "../../components/Brand/BrandSix";

const AboutPageFour = () => {
  return (
    <Layout footer={2} breadcrumb={"About"}  title={'About us'}>
      {/* about-area */}
      <AboutTen />

      {/* features-area */}
      <FeatureSix />

      {/* features-area */}
      <FeatureSeven />

      {/* team-area */}
      <TeamAreaTwo />

      {/* request-area */}
      <RequestAreaTwo />

      {/* brand-area */}
      <BrandSix />
    </Layout>
  );
};

export default AboutPageFour;
