import React from "react";
import styled from "styled-components";
import { COLORS, txt } from "../other/constants";
import { useSelector } from "react-redux";

const ErrWrap = styled.div`
  position: fixed;
  width: 50%;
  left: 25%;
  color: ${COLORS.LIGHT};
  z-index: 1002;
  border-radius: 5px;
  background: ${COLORS.LIGHT_DARK};
  display: flex;
  padding: 3px;
  flex-direction: column;
  overflow: hidden;
  text-align: center;
  transition: 0.3s ease all;
  top: ${({ visible }) => (visible ? "5px" : "-100px")};
  border: ${({ ok }) =>
    ok
      ? `2px solid ${COLORS.SUCCESS_COLOR}`
      : `2px solid ${COLORS.ERROR_COLOR}`};
  text-transform: ${({ ok }) => ok && "uppercase"};
  @media (max-width: 768px) {
    width: 95%;
    left: 2.5%;
  }
`;

export const Err = React.memo(({ err, ok }) => {
  const { lng } = useSelector((state) => state.common);

  let errText = "";
  if (err) {
    if (err.ownErr) {
      errText = err.ownErr;
    } else if (err.debugMessage) {
      errText = err.debugMessage;
    } else if (err.message) {
      errText = err.message;
    } else {
      errText = txt[lng].err.unrec;
    }
  }

  return (
    <ErrWrap visible={errText} ok={ok}>
      <p>{errText}</p>
    </ErrWrap>
  );
});
