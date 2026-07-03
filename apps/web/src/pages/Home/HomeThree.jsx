import { AboutFive } from "../../components/About/AboutFive";
import { BannerFour } from "../../components/Banners/BannerFour";
import { BlogAreaFour } from "../../components/BlogAreas/BlogAreaFour";
import { BrandFour } from "../../components/Brand/BrandFour";
import { ChooseAreaTwo } from "../../components/ChooseAreas/ChooseAreaTwo";
import { CtaAreaThree } from "../../components/CtaAreas/CtaAreaThree";
import { EstimateAreaOne } from "../../components/EstimateAreas/EstimateAreaOne";
import { FeatureFour } from "../../components/Features/FeatureFour";
import { PricingAreaThree } from "../../components/PricingAreas/PricingAreaThree";
import { ServicesThree } from "../../components/Services/ServicesThree";
import { TeamAreaFour } from "../../components/TeamAreas/TeamAreaFour";
import { TestimonialAreaFour } from "../../components/TestimonialAreas/TestimonialAreaFour";
import { Layout } from "../../layouts/Layout";

const HomeThree = () => {
  return (
    <Layout header={4} footer={1}>
      {/* banner-area */}
      <BannerFour />

      {/* features-area */}
      <FeatureFour />

      {/* about-area */}
      <AboutFive />

      {/* brand-area */}
      <BrandFour />

      {/* services-area */}
      <ServicesThree />

      {/* choose-area */}
      <ChooseAreaTwo />

      {/* cta-area */}
      <CtaAreaThree />

      {/* estimate-area */}
      <EstimateAreaOne />

      {/* team-area */}
      <TeamAreaFour />

      {/* testimonial-area */}
      <TestimonialAreaFour />

      {/* pricing-area */}
      <PricingAreaThree />

      {/* blog-area */}
      <BlogAreaFour />
    </Layout>
  );
};

export default HomeThree;
