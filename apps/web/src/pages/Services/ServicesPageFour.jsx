import React from "react";
import { Layout } from "../../layouts/Layout";
import { BrandSix } from "../../components/Brand/BrandSix";
import { ServicesThree } from "../../components/Services/ServicesThree";

const ServicesPageFour = () => {
  return (
    <Layout breadcrumb={"Services"}  title={'Our Services'} >
      {/* services */}
      <ServicesThree isServicePage />

      {/* brand-area */}
      <BrandSix />
    </Layout>
  );
};

export default ServicesPageFour;
