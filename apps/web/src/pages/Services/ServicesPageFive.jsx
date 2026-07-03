import React from "react";
import { Layout } from "../../layouts/Layout";
import { BrandSix } from "../../components/Brand/BrandSix";
import { ServiceFour } from "../../components/Services/ServiceFour";

const ServicesPageFive = () => {
  return (
    <Layout breadcrumb={"Services"}  title={'Our Services'} >
      {/* services */}
      <ServiceFour className={"services-area-seven"} isServicePage />

      {/* brand-area */}
      <BrandSix />
    </Layout>
  );
};

export default ServicesPageFive;
