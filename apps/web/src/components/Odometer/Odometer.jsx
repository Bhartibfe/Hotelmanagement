import React from "react";
import CountUp from "react-countup";

export const Odometer = ({ end, ...props }) => {
  return (
    <CountUp
      className="odometer"
      end={end}
      enableScrollSpy
      scrollSpyOnce={false}
      {...props}
    />
  );
};
