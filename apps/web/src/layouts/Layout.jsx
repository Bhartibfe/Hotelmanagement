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
import { HeaderSix } from "../components/Headers/HeaderSix";
import ErrorBoundary from "../components/ErrorBoundary";
import { useHeaderSpacer } from "../lib/hooks/useHeaderSpacer";

export const Layout = ({ children, header, footer, transparentHeader }) => {
  const h = Number(header);
  const f = Number(footer);

  useHeaderSpacer();

  return (
    <>
      <ScrollToTopButton />

      {h === 2 && <HeaderTwo />}
      {h === 3 && <HeaderThree />}
      {h === 4 && <HeaderFour />}
      {h === 5 && <HeaderFive />}
      {h === 6 && <HeaderSix />}
      {(!header || h === 1) && <HeaderOne transparent={transparentHeader} />}

      {/* Spacer to push content below the fixed header (not needed for transparent overlay) */}
      {!transparentHeader && <div className="header-spacer" />}

      <main className="fix">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>

      {(!footer || f === 1) && <FooterOne />}
      {f === 2 && <FooterTwo />}
      {f === 3 && <FooterThree />}
    </>
  );
};
