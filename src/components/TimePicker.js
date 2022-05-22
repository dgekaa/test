import React from "react";
import styled from "styled-components";
import { COLORS, txt } from "../other/constants";
import { HiOutlineArrowSmUp, HiOutlineArrowSmDown } from "react-icons/hi";
import { useSelector } from "react-redux";

const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    background: ${COLORS.DARK};
    border-radius: 5px;
    padding: 10px;
    justify-content: center;
    align-items: center;
  `,
  TimeContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100px;
  `,
  Time = styled.div`
    text-transform: uppercase;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    margin: 10px;
  `,
  Top = styled.div`
    margin: 0 20px;
    display: flex;
    flex: 1;
    background: ${COLORS.LIGHT};
    border-radius: 5px;
    cursor: pointer;
    transition: 0.2s ease opacity;
    color: ${COLORS.LIGHT_DARK};
    justify-content: center;
    align-items: center;
    &:hover {
      opacity: 0.8;
    }
  `,
  Bottom = styled(Top)``;

export const TimePicker = ({ time, click }) => {
  const { lng } = useSelector((state) => state.common);
  const arr = time.split(":"),
    h = arr[0],
    m = arr[1];

  if (time) {
    return (
      <Container>
        <TimeContainer>
          <Top onClick={() => click(true, true)}>
            <HiOutlineArrowSmUp />
          </Top>
          <Time>
            {h} {txt[lng].time.h}
          </Time>
          <Bottom onClick={() => click(false, true)}>
            <HiOutlineArrowSmDown />
          </Bottom>
        </TimeContainer>
        :
        <TimeContainer>
          <Top onClick={() => click(true, false)}>
            <HiOutlineArrowSmUp />
          </Top>
          <Time>
            {m} {txt[lng].time.m}
          </Time>
          <Bottom onClick={() => click(false, false)}>
            <HiOutlineArrowSmDown />
          </Bottom>
        </TimeContainer>
      </Container>
    );
  }
  return <></>;
};
