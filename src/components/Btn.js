import React from "react";
import styled from "styled-components";
import { COLORS } from "../other/constants";

const BtnContainer = styled.button`
  width: 100%;
  height: 100%;
  background-color: ${COLORS.DARK};
  border: none;
  outline: none;
  border-radius: 5px;
  color: ${COLORS.LIGHT};
  text-transform: uppercase;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: 0.1s ease box-shadow;
  z-index: ${({ z }) => z && z};
  border: ${({ active }) => active && `3px solid ${COLORS.LIGHT}`};
  &:hover {
    box-shadow: 0 0 7px 0 ${COLORS.LIGHT_DARK} inset;
  }
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const Btn = ({ text, click, style, z, active }) => (
  <BtnContainer z={z} style={style} onClick={click} active={active}>
    {text}
  </BtnContainer>
);
