import React from "react";
import { COLORS } from "../other/constants";
import { Range } from "react-range";

export const MyRange = ({ blur, setBlur, fetchBlur, stream }) => (
  <Range
    step={5}
    min={0}
    max={100}
    values={[blur]}
    onChange={(values) => setBlur(values[0])}
    onFinalChange={(values) => fetchBlur(values[0], stream.id)}
    renderTrack={({ props, children }) => (
      <div
        {...props}
        style={{
          ...props.style,
          height: "6px",
          width: "100%",
          backgroundColor: COLORS.LIGHT,
          marginRight: "10px",
        }}
      >
        {children}
      </div>
    )}
    renderThumb={({ props }) => (
      <div
        {...props}
        style={{
          ...props.style,
          height: "42px",
          width: "42px",
          borderRadius: "5px",
          backgroundColor: COLORS.DARK,
          color: COLORS.LIGHT,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: `2px solid ${COLORS.LIGHT}`,
          outline: "none",
        }}
      >
        <span>{blur}</span>
      </div>
    )}
  />
);
