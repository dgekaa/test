import React from "react";
import { COLORS } from "../other/constants";
import styled, { keyframes } from "styled-components";

const show = keyframes`
  from {
    opacity:0;
    transform: scale(0.5);
  }
  to {
    opacity:1;
    transform: scale(1);
  }
`;

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1001;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${({ close }) =>
      close ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.9)"};
  `,
  ClickableBlock = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  `,
  Inner = styled.div`
    animation: ${show} 0.3s ease;
    width: 450px;
    background: ${COLORS.DARK};
    border-radius: 10px;
    position: relative;
    padding: 20px;
    display: flex;
    flex-direction: column;
    width: ${({ big }) => (big ? "85%" : "450px")};
    height: ${({ big }) => (big ? "85%" : "auto")};
    @media (max-width: 768px) {
      width: 80%;
    }
  `,
  Close = styled.div`
    position: absolute;
    top: -15px;
    right: -15px;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${COLORS.LIGHT};
    background: ${COLORS.DARK};
    cursor: pointer;
    transition: 0.1s ease all;
    text-transform: uppercase;
    padding: 0 0 2px 0;
    line-height: 30px;
    border: 2.5px solid ${COLORS.LIGHT};
    z-index: 1001;
    &:hover {
      color: ${COLORS.ERROR_COLOR};
      border: 2.5px solid ${COLORS.ERROR_COLOR};
    }
  `,
  Header = styled.div`
    display: flex;
    justify-content: center;
    color: ${COLORS.LIGHT};
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
  `,
  Content = styled.div`
    display: flex;
    color: ${COLORS.LIGHT};
    font-weight: bold;
    flex: 1;
  `,
  Footer = styled.div`
    display: flex;
    justify-content: center;
    color: ${COLORS.LIGHT};
    text-transform: uppercase;
    font-weight: bold;
  `;

export const Popup = ({ visible, header, content, footer, close, big }) => {
  if (visible) {
    return (
      <Container close={close}>
        <ClickableBlock onClick={close} />
        <Inner big={big} onClick={(e) => e.stopPropagation()}>
          <Header>{header}</Header>
          <Content>{content}</Content>
          <Footer>{footer}</Footer>
          {close && <Close onClick={close}>&#10006;</Close>}
        </Inner>
      </Container>
    );
  } else {
    return <></>;
  }
};
