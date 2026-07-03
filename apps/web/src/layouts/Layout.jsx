import React from "react";
import { ScrollToTopButton } from "../components/ScrollToTopButton/ScrollToTopButton";
import { HeaderTwo } from "../components/Headers/HeaderTwo";
import { FooterTwo } from "../components/Footers/FooterTwo";
import { HeaderThree } from "../components/Headers/HeaderThree";
import { FooterThree } from "../components/Footers/FooterThree";
import { HeaderFour } from "../components/Headers/HeaderFour";
import { FooterOne } from "../components/Footers/FooterOne";
import { HeaderFive } from "../components/Headers/HeaderFive";
import { HeaderOne } from "../components/Headers/HeaderOne";
import { Breadcrumb } from "../components/Breadcrumb/Breadcrumb";
import { HeaderSix } from "../components/Headers/HeaderSix";

export const Layout = ({ children, header, footer, breadcrumb, title }) => {
  return (
    <>
      {/* Scroll-top  */}
      <ScrollToTopButton />

      {/* header */}
      {header == 1 && <HeaderOne />}
      {header == 2 && <HeaderTwo />}
      {header == 3 && <HeaderThree />}
      {header == 4 && <HeaderFour />}
      {header == 5 && <HeaderFive />}
      {(!header || header == 6) && <HeaderSix />}

      {/* breadcrumb */}
      {breadcrumb && <Breadcrumb text={breadcrumb} title={title} />}

      {/* children */}
      <main className="fix">{children}</main>

      {/* footer */}
      {(!footer || footer == 1) && <FooterOne />}
      {footer == 2 && <FooterTwo />}
      {footer == 3 && <FooterThree />}
    </>
  );
};
