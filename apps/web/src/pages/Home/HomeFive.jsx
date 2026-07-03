import { AboutOne } from "../../components/About/AboutOne";
import { AboutTwo } from "../../components/About/AboutTwo";
import { BlogPostArea } from "../../components/BlogAreas/BlogPostArea";
import { BrandOne } from "../../components/Brand/BrandOne";
import { ContactAreaOne } from "../../components/ContactAreas/ContactAreaOne";
import { CounterAreaOne } from "../../components/CounterAreas/CounterAreaOne";
import { FaqAreaOne } from "../../components/FaqAreas/FaqAreaOne";
import { FeatureOne } from "../../components/Features/FeatureOne";
import { PricingAreaOne } from "../../components/PricingAreas/PricingAreaOne";
import { ProjectAreaOne } from "../../components/ProjectAreas/ProjectAreaOne";
import { RequestAreaOne } from "../../components/RequestAreas/RequestAreaOne";
import { ServiceOne } from "../../components/Services/ServiceOne";
import { SliderAreaOne } from "../../components/SliderAreas/SliderAreaOne";
import { TeamAreaOne } from "../../components/TeamAreas/TeamAreaOne";
import { TestimonialAreaOne } from "../../components/TestimonialAreas/TestimonialAreaOne";
import { Layout } from "../../layouts/Layout";

const HomeFive = () => {
  return (
    <Layout header={1}>
      {/* banner-area */}
      <SliderAreaOne />

      {/* about-area */}
      <AboutOne />

      {/* features-area */}
      <FeatureOne />

      {/* about-area */}
      <AboutTwo />

      {/* services-area */}
      <ServiceOne />

      {/* counter-area */}
      <CounterAreaOne />

      {/* project-area */}
      <ProjectAreaOne />

      {/* faq-area */}
      <FaqAreaOne />

      {/* request-area */}
      <RequestAreaOne />

      {/* team-area */}
      <TeamAreaOne />

      {/* testimonial-area */}
      <TestimonialAreaOne />

      {/* pricing-area */}
      <PricingAreaOne />

      {/* contact-area */}
      <ContactAreaOne />

      {/* blog-post-area */}
      <BlogPostArea />

      {/* brand-area */}
      <BrandOne />
    </Layout>
  );
};

export default HomeFive;
