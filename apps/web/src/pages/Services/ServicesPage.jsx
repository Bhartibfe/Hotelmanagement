import React from "react";
import { Layout } from "../../layouts/Layout";
import { ServiceFive } from "../../components/Services/ServiceFive";

const ServicesPage = () => {
  return (
    <Layout breadcrumb={"Services"}  title={'Our Services'} >
      {/* services */}
      <ServiceFive />
    </Layout>
  );
};

export default ServicesPage;
