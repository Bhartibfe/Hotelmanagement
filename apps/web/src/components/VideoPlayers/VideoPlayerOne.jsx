import React from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Iframe from "react-iframe";

export const VideoPlayerOne = ({ src, text, ...props }) => {
  return (
    <Popup
      trigger={
        <a
          {...props}
          href="#vid"
          onClick={(e) => e.preventDefault()}
          className="play-btn popup-video"
        >
          <i className="fas fa-play"></i> <span>{text}</span>
        </a>
      }
      position=""
      modal={true}
      contentStyle={{
        width: "80%",
        maxWidth: 800,
      }}
      lockScroll
    >
      <Iframe
        url={src}
        width="100%"
        height="300px"
        id=""
        className=""
        display="block"
        position="relative"
      />
    </Popup>
  );
};
