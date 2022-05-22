import React, { useRef, useState } from "react";
import styled from "styled-components";
import { COLORS, txt } from "../other/constants";
import { Search } from "../other/svg";
import { useSelector } from "react-redux";
import { DOTS } from "../other/styles";

const Container = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
  `,
  Placeholder = styled(DOTS)`
    position: absolute;
    top: ${({ text, icon }) => (text ? "-9px" : !icon ? "13px" : "5px")};
    font-size: ${({ text }) => (text ? "12px" : "16px")};
    color: ${COLORS.LIGHT};
    transition: 0.3s ease all;
    left: ${({ icon }) => (!icon ? "15px" : " 5px")};
    text-transform: capitalize;
    width: 100%;
    @media (max-width: 768px) {
      left: ${({ icon }) => (icon ? "9px" : " 5px")};
      top: ${({ text, icon }) => (text ? "-7px" : !icon ? "10px" : "7px")};
      font-size: ${({ text }) => (text ? "10px" : "14px")};
    }
  `,
  Input = styled.input`
    cursor: ${({ pointer }) => pointer && "pointer"};
    -webkit-touch-callout: text;
    -webkit-user-select: text;
    -khtml-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
    outline: none;
    border: none;
    color: ${COLORS.LIGHT};
    position: relative;
    transition: 0.3s ease all;
    width: 100%;
    height: 100%;
    padding: 0 15px;
    background-color: ${COLORS.LIGHT_DARK};
    border-radius: 5px;
    @media (max-width: 768px) {
      border-radius: 5px;
      padding: ${({ icon }) => (icon ? "0 10px" : "0 15px")};
      font-size: 12px;
    }
  `,
  SearchWrap = styled.div`
    position: absolute;
    width: 30px;
    height: 100%;
    display: flex;
    justify-content: center;
    top: 0;
    align-items: center;
    right: 0px;
    background-color: ${COLORS.LIGHT_DARK};
    border-radius: 0 5px 5px 0;
    @media (max-width: 768px) {
      display: none;
    }
  `;

export const SearchInput = ({
  value,
  changeText,
  placeholder,
  icon,
  type,
  disabled,
  onClick,
  name,
  pointer,
}) => {
  const [focus, setFocus] = useState("");

  const placeholderRef = useRef(null);

  const { lng } = useSelector((state) => state.common);

  const placeholderClick = () => placeholderRef.current.focus();

  return (
    <Container onClick={onClick}>
      <Input
        icon={icon}
        disabled={disabled}
        type={type || "text"}
        ref={placeholderRef}
        placeholder=""
        value={value}
        onChange={(e) => changeText(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        name={name}
        pointer={pointer}
      />
      <Placeholder icon={icon} text={value || focus} onClick={placeholderClick}>
        {placeholder || txt[lng].header.search}
      </Placeholder>
      {icon && (
        <SearchWrap text={value}>{Search(20, 20, COLORS.LIGHT)}</SearchWrap>
      )}
    </Container>
  );
};
