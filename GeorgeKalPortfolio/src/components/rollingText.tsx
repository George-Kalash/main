import React from "react";
import Marquee from "react-fast-marquee";

export default function RollingText() {
  return (
    <div className="min-w-2xs max-w-3/4 m-auto overflow-hidden">
      <div className="flex overflow-hidden perspective-[600px] h-100 self-center-safe justify-self-center-safe mt-52">
        <Marquee
          speed={200}
          className="ml-10 m-20 text-[130px] font-semibold text-center text-white"
          style={{transform: "rotateY(-10deg) skewX(1deg) skewY(-1deg) translateZ(0px) perspective(100vw) rotateY(18deg)"}}
        >
        <h1 className="opacity-0"> Lorem </h1>
        <h1>  Ideas Are Just Ideas Without Someone to Make Them a Reality!   </h1>
        <h1 className="opacity-0"> Lorem </h1>
        </Marquee>
      </div>
    </div>
  );
}