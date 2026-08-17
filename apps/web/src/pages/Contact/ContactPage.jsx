import React from "react";
import { Layout } from "../../layouts/Layout";
import { ContactAreaInner } from "../../components/ContactAreas/ContactAreaInner";

const ContactPage = () => {
  return (
    <Layout header={1} footer={1} breadcrumb={"Contact"} title={"Contact Us"}>
      <ContactAreaInner />
    </Layout>
  );
};

export default ContactPage;
