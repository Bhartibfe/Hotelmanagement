import React from "react";
import { Layout } from "../../layouts/Layout";
import { BrandSix } from "../../components/Brand/BrandSix";
import { CtaAreaFive } from "../../components/CtaAreas/CtaAreaFive";
import { ServiceSeven } from "../../components/Services/ServiceSeven";

const ServicesPageThree = () => {
  return (
    <Layout breadcrumb={"Services"}  title={'Our Services'} >
      {/* services */}
      <ServiceSeven />

      {/* cta-area */}
      <CtaAreaFive />

      {/* brand-area */}
      <BrandSix />
    </Layout>
  );
};

export default ServicesPageThree;
