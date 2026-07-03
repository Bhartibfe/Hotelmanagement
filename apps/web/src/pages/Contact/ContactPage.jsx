import React from "react";
import { Layout } from "../../layouts/Layout";
import { ContactAreaInner } from "../../components/ContactAreas/ContactAreaInner";
import { ContactAreaMap } from "../../components/ContactAreas/ContactAreaMap";

const ContactPage = () => {
  return (
    <Layout header={1} footer={1} breadcrumb={"Contact"} title={"Contact Us"}>
      <ContactAreaInner />
      <ContactAreaMap />
    </Layout>
  );
};

export default ContactPage;
