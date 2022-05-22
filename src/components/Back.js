import React from "react";
import styled from "styled-components";
import { txt } from "../other/constants";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineArrowSmLeft } from "react-icons/hi";

const GoBack = styled(Link)`
    display: flex;
    width: 120px;
    align-items: center;
    padding: 15px 0;
    transition: 0.2s ease all;
    &:hover {
      opacity: 0.6;
      transform: translateX(2px);
    }
  `,
  GoBackText = styled.span`
    margin-bottom: 1px;
    font-size: 10px;
    font-weight: bold;
    text-transform: uppercase;
  `;

export const Back = ({ param }) => {
  const { lng } = useSelector((state) => state.common);

  return (
    <GoBack to={param}>
      <HiOutlineArrowSmLeft />
      <GoBackText>{txt[lng].goback.goback}</GoBackText>
    </GoBack>
  );
};
