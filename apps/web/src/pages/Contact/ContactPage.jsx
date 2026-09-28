import React from "react";
import { Layout } from "../../layouts/Layout";
import { ContactAreaInner } from "../../components/ContactAreas/ContactAreaInner";
import Seo from "../../components/seo/Seo";

const ContactPage = () => {
  return (
    <Layout header={1} footer={1} breadcrumb={"Contact"} title={"Contact Us"}>
      <Seo
        title="Contact Us"
        description="Get in touch with the Hotel Sircle team about membership, partnerships or speaking at an event."
        canonical="/contact"
      />
      <ContactAreaInner />
    </Layout>
  );
};

export default ContactPage;
