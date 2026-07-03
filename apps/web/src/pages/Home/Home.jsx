import { HeroSection } from "../../components/home/HeroSection";
import { NetworkStatsSection } from "../../components/home/NetworkStatsSection";
import { FeaturedVendorsSection } from "../../components/home/FeaturedVendorsSection";
import { FeaturedExpertsSection } from "../../components/home/FeaturedExpertsSection";
import { EventsPreview } from "../../components/home/EventsPreview";
import { TestimonialsSection } from "../../components/home/TestimonialsSection";
import { JoinNetworkCTA } from "../../components/home/JoinNetworkCTA";
import { BrandTwo } from "../../components/Brand/BrandTwo";
import { Layout } from "../../layouts/Layout";

const Home = () => {
  return (
    <Layout header={1} footer={1}>
      {/* Hero Section */}
      <HeroSection />

      {/* Network Statistics */}
      <NetworkStatsSection />

      {/* Industry Experts */}
      <FeaturedExpertsSection />

      {/* Featured Vendors */}
      <FeaturedVendorsSection />

      {/* Upcoming Events */}
      <EventsPreview />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Partner Brands */}
      <BrandTwo title="Trusted by Leading Hospitality Brands" />

      {/* Join Network CTA */}
      <JoinNetworkCTA />
    </Layout>
  );
};

export default Home;
