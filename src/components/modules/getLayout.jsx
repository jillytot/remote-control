import React from "react";
import { useWindowDimensions } from "../providers/windowDimensionProvider";
import { breakPoint } from "../../config/clientSettings";

//Interface for event listener, will return cb based window size
const GetLayout = ({ breakpoint, renderMobile, renderDesktop }) => {
  const fragment = () => {
    return <React.Fragment />;
  };
  const mobile = renderMobile || fragment;
  const desktop = renderDesktop || fragment;
  const getBreakPoint = breakpoint || breakPoint;
  const { width } = useWindowDimensions();
  // console.log("Get width: ", width);
  return width > getBreakPoint ? desktop() : mobile();
};

export default GetLayout;
