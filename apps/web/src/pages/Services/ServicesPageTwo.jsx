import React from "react";
import { Layout } from "../../layouts/Layout";
import { BrandSix } from "../../components/Brand/BrandSix";
import { ServiceSix } from "../../components/Services/ServiceSix";

const ServicesPageTwo = () => {
  return (
    <Layout breadcrumb={"Services"} title={"Our Services"}>
      {/* services */}
      <ServiceSix />

      {/* brand-area */}
      <BrandSix />
    </Layout>
  );
};

export default ServicesPageTwo;
