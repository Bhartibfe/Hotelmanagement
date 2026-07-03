import React from "react";
import { Layout } from "../../layouts/Layout";
import { AboutEleven } from "../../components/About/AboutEleven";
import { AboutTwelve } from "../../components/About/AboutTwelve";
import { CtaAreaFive } from "../../components/CtaAreas/CtaAreaFive";
import { TeamAreaSix } from "../../components/TeamAreas/TeamAreaSix";
import { RequestAreaOne } from "../../components/RequestAreas/RequestAreaOne";

const AboutPageFive = () => {
  return (
    <Layout footer={2} breadcrumb={"About"}  title={'About us'}>
      {/* about-area */}
      <AboutEleven />

      {/* about-area */}
      <AboutTwelve />

      {/* cta-area */}
      <CtaAreaFive />

      {/* team-area */}
      <TeamAreaSix />

      {/* request-area */}
      <RequestAreaOne />
    </Layout>
  );
};

export default AboutPageFive;
