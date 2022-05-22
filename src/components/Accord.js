import React, { useState } from "react";
import styled from "styled-components";
import { COLORS } from "../other/constants";
import { BiPlus, BiMinus } from "react-icons/bi";

const AccordStyles = styled.div``,
  AccBtn = styled.div`
    border: 0;
    margin: 10px 0;
    padding: 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: inherit;
    background: ${COLORS.DARK};
    color: ${COLORS.LIGHT};
    cursor: pointer;
    border-radius: ${({ active }) => (active ? "5px 5px 0 0" : "5px")};
    transition: 0.3s ease all;
    font-weight: bold;
    &:focus {
      outline: none;
    }
  `,
  AccBtnLeft = styled.div`
    width: 100%;
  `,
  AccBtnRight = styled.div`
    height: 30px;
    width: 30px;
    border-radius: 50%;
    color: #fff;
    background: ${COLORS.LIGHT};
    color: ${COLORS.DARK};
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    text-align: center;
    padding: 5px 0 4px 0px;
  `,
  AccContent = styled.div`
    background: ${COLORS.LIGHT};
    transition: 0.3s ease all;
    margin: 0;
    margin-top: -10px;
    border: 2px solid ${COLORS.DARK};
    border-top: 0;
    height: ${({ active }) => (active ? "auto" : 0)};
    opacity: ${({ active }) => (active ? 1 : 0)};
    padding: ${({ active }) => (active ? "10px" : "0 10px")};
    color: ${COLORS.DARK};
    border-radius: 0 0 5px 5px;
    overflow: hidden;
  `;

export const Accord = () => {
  const hiddenTexts = [
    {
      label:
        "Button 1 asdas dasdas dasdas das das das d asdasdas dasdas das das das d asd asd sad as dsa das dsadasdas dadas das das d asd asd sad as dsa das dsadasdas dad a dasdas das das das d asd asd sad as dsa das dsadasdas dasd sad dasdas das das das d asd asd sad as dsa das dsadasdas daas dsa das dsadasdas das dasdasd dsad asd asd asd",
      value:
        "Text odasdas das das das d asd asd sad as dsa das dsadasdas dadasdas das das das d asd asd sad as dsa das dsadasdas dadasdas das das das d asd asd sad as dsa das dsadasdas dadasdas das das das d asd asd sad as dsa das dsadasdas dadasdas das das das d asd asd sad as dsa das dsadasdas daf Accordion 1",
    },
    {
      label: "Button 2",
      value: "Text of Accordion 2",
    },
    {
      label: "Button 3",
      value: "Text of Accordion 3",
    },
    {
      label: "Button 4",
      value: "Text of Accordion 4",
    },
  ];

  return <Accordion hiddenTexts={hiddenTexts} />;
};

const Accordion = ({ hiddenTexts }) => {
  return (
    <AccordStyles>
      {hiddenTexts.map((hiddenText) => (
        <AccordionItem key={hiddenText.label} hiddenText={hiddenText} />
      ))}
    </AccordStyles>
  );
};

const AccordionItem = ({ hiddenText }) => {
  const [visibility, setVisibility] = useState(false);

  const handleToggleVisibility = () => {
    setVisibility((prev) => !prev);
  };

  return (
    <div>
      <AccBtn onClick={handleToggleVisibility} active={visibility}>
        <AccBtnLeft>{hiddenText.label}</AccBtnLeft>
        <AccBtnRight>{visibility ? <BiMinus /> : <BiPlus />}</AccBtnRight>
      </AccBtn>
      <AccContent active={visibility}>{hiddenText.value}</AccContent>
    </div>
  );
};
