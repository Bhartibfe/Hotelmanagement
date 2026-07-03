import React from "react";
import { Layout } from "../../layouts/Layout";
import { BrandSix } from "../../components/Brand/BrandSix";
import { AboutEight } from "../../components/About/AboutEight";
import { ChooseAreaThree } from "../../components/ChooseAreas/ChooseAreaThree";
import { TeamAreaOne } from "../../components/TeamAreas/TeamAreaOne";
import { TestimonialAreaThree } from "../../components/TestimonialAreas/TestimonialAreaThree";

const AboutPageTwo = () => {
  return (
    <Layout breadcrumb={"About"}  title={'About us'}>
      {/* about-area */}
      <AboutEight />

      {/* choose-area */}
      <ChooseAreaThree />

      {/* team-area */}
      <TeamAreaOne />

      {/* testimonial-area */}
      <TestimonialAreaThree
        className={"testimonial-area-three testimonial-area-six pt-120"}
      />

      {/* brand-area */}
      <BrandSix />
    </Layout>
  );
};

export default AboutPageTwo;
