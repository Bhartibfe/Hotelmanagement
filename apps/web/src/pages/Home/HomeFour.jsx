import { AboutSix } from "../../components/About/AboutSix";
import { BannerFive } from "../../components/Banners/BannerFive";
import { BlogAreaFive } from "../../components/BlogAreas/BlogAreaFive";
import { BrandFive } from "../../components/Brand/BrandFive";
import { CounterAreaThree } from "../../components/CounterAreas/CounterAreaThree";
import { CtaAreaFour } from "../../components/CtaAreas/CtaAreaFour";
import { ProjectAreaFour } from "../../components/ProjectAreas/ProjectAreaFour";
import { RequestAreaOne } from "../../components/RequestAreas/RequestAreaOne";
import { ServiceFour } from "../../components/Services/ServiceFour";
import { TeamAreaFive } from "../../components/TeamAreas/TeamAreaFive";
import { TestimonialAreaFive } from "../../components/TestimonialAreas/TestimonialAreaFive";
import { Layout } from "../../layouts/Layout";

const HomeFour = () => {
  return (
    <Layout header={5} footer={2}>
      {/* banner-area */}
      <BannerFive />

      {/* brand-area */}
      <BrandFive />

      {/* services-area */}
      <ServiceFour />

      {/* about-area */}
      <AboutSix />

      {/* counter-area */}
      <CounterAreaThree />

      {/* team-area */}
      <TeamAreaFive />

      {/* project-area */}
      <ProjectAreaFour />

      {/* cta-area */}
      <CtaAreaFour />

      {/* testimonial-area */}
      <TestimonialAreaFive />

      {/* blog-area */}
      <BlogAreaFive />

      {/* request-area */}
      <RequestAreaOne />
    </Layout>
  );
};

export default HomeFour;
