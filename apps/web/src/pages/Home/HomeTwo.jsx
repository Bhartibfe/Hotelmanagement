import { AboutFour } from "../../components/About/AboutFour";
import { BannerThree } from "../../components/Banners/BannerThree";
import { BlogAreaThree } from "../../components/BlogAreas/BlogAreaThree";
import { BrandTwo } from "../../components/Brand/BrandTwo";
import { CounterAreaTwo } from "../../components/CounterAreas/CounterAreaTwo";
import { CtaAreaTwo } from "../../components/CtaAreas/CtaAreaTwo";
import { FeatureThree } from "../../components/Features/FeatureThree";
import { OverviewAreaTwo } from "../../components/OverviewAreas/OverviewAreaTwo";
import { ProjectAreaThree } from "../../components/ProjectAreas/ProjectAreaThree";
import { TeamAreaThree } from "../../components/TeamAreas/TeamAreaThree";
import { TestimonialAreaThree } from "../../components/TestimonialAreas/TestimonialAreaThree";
import { Layout } from "../../layouts/Layout";

const HomeTwo = () => {
  return (
    <Layout header={3} footer={3}>
      {/* banner-area */}
      <BannerThree />

      {/* brand-area */}
      <BrandTwo title={"Trusted by 10,000+ companies around the world"} />

      {/* features-area */}
      <FeatureThree />

      {/* about-area */}
      <AboutFour />

      {/* overview-area */}
      <OverviewAreaTwo />

      {/* project-area */}
      <ProjectAreaThree />

      {/* counter-area */}
      <CounterAreaTwo />

      {/* team-area */}
      <TeamAreaThree />

      {/* testimonial-area */}
      <TestimonialAreaThree />

      {/* cta-area */}
      <CtaAreaTwo />

      {/* blog-area */}
      <BlogAreaThree />
    </Layout>
  );
};

export default HomeTwo;
