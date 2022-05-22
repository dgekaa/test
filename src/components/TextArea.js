import React, { useRef, useState } from "react";
import styled from "styled-components";

import { COLORS } from "../other/constants";

const Container = styled.div`
    position: relative;
    margin: ${({ margin }) => (margin ? margin : "0")};
    height: ${({ height }) => (height ? height : "200px")};
  `,
  Placeholder = styled.div`
    position: absolute;
    top: ${({ text }) => (text ? "-9px" : "10px")};
    font-size: ${({ text }) => (text ? "12px" : "16px")};
    color: ${COLORS.LIGHT};
    transition: 0.3s ease all;
    left: 15px;
    text-transform: capitalize;
  `,
  Length = styled.div`
    position: absolute;
    top: -9px;
    color: ${COLORS.LIGHT};
    right: 5px;
    font-size: 12px;
  `,
  Limit = styled.span`
    color: ${COLORS.ERROR_COLOR};
  `,
  FirstLim = styled.span`
    color: ${({ maxval }) =>
      maxval ? COLORS.ERROR_COLOR : COLORS.SUCCESS_COLOR};
  `,
  Area = styled.textarea`
    outline: none;
    border: none;
    border-radius: 5px;
    color: ${COLORS.LIGHT};
    position: relative;
    transition: 0.3s ease all;
    width: 100%;
    padding: 5px;
    background-color: ${COLORS.LIGHT_DARK};
    resize: none;
    padding: 15px;
    height: ${({ height }) => (height ? height : "200px")};
    &::-webkit-scrollbar {
      width: 3px;
      height: 3px;
    }
    &::-webkit-scrollbar-track {
      background-color: ${COLORS.LIGHT_DARK};
      width: 3px;
      position: relative;
    }
    &::-webkit-scrollbar-corner {
      background-color: green;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: ${COLORS.LIGHT};
      width: 3px;
    }
  `;

export const TextArea = ({
  value,
  changeText,
  margin,
  placeholder,
  height,
  max,
}) => {
  const [focus, setFocus] = useState("");

  const areaRef = useRef(null);

  const placeholderClick = () => areaRef.current.focus(),
    inputChange = (e) => changeText(e.target.value);

  return (
    <Container margin={margin} height={height}>
      <Area
        height={height}
        maxLength={max}
        ref={areaRef}
        value={value}
        onChange={inputChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />

      <Placeholder text={value || focus} onClick={placeholderClick}>
        {placeholder}
      </Placeholder>

      <Length>
        <FirstLim maxval={value.length === max}>{value.length}</FirstLim>/
        <Limit>{max}</Limit>
      </Length>
    </Container>
  );
};
