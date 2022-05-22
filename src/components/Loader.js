import React from "react";
import styled from "styled-components";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { BallTriangle } from "react-loader-spinner";
import { COLORS } from "../other/constants";

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1002;
  `,
  LogoWrap = styled.div`
    width: 100;
    height: 100;
    position: relative;
  `,
  Bottom = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 5px;
  `;

export const Loader = ({ bottom }) => {
  if (bottom) {
    return (
      <Bottom>
        <BallTriangle color={COLORS.DARK} height={40} width={40} />
      </Bottom>
    );
  } else {
    return (
      <Container>
        <LogoWrap>
          <BallTriangle color={COLORS.DARK} height={80} width={80} />
        </LogoWrap>
      </Container>
    );
  }
};
