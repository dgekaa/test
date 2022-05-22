import React from "react";
import styled from "styled-components";
import { COLORS, txt } from "../other/constants";
import { commonActions } from "../store/common";
import { useDispatch, useSelector } from "react-redux";
import { Btn } from "../components";
import Modal from "react-responsive-modal";
import Flag from "react-world-flags";

import "react-responsive-modal/styles.css";

const Left = styled.div`
    overflow: auto;
    padding-top: 15px;
    &::-webkit-scrollbar {
      width: 3px;
      height: 3px;
    }
    &::-webkit-scrollbar-track {
      background-color: ${COLORS.LIGHT};
      width: 3px;
      position: relative;
    }
    &::-webkit-scrollbar-corner {
      background-color: green;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: ${COLORS.LIGHT_DARK};
      width: 3px;
    }
  `,
  BtnWrap = styled.div`
    height: 50px;
    width: 70%;
    @media (max-width: 768px) {
      height: 40px;
    }
  `,
  BlockWrap = styled.div`
    display: flex;
    border: 2px solid ${COLORS.LIGHT};
    padding: 5px;
    margin-top: 10px;
    border-radius: 5px;
  `,
  Block = styled.div`
    display: flex;
    padding: 5px;
    flex-direction: column;
    border-right: 2px solid ${COLORS.LIGHT};
  `,
  Active = styled.div`
    flex: 1;
    display: flex;
    color: ${COLORS.LIGHT};
    justify-content: center;
    padding-left: 10px;
  `,
  SubBlock = styled.div`
    flex: 1;
    display: flex;
    padding-left: 15px;
    position: relative;
    &::before {
      content: "";
      width: 4px;
      height: 4px;
      border-radius: 2px;
      background: ${COLORS.DARK};
      position: absolute;
      top: 11px;
      left: 4px;
    }
  `,
  Btns = styled.div`
    display: flex;
    width: 100%;
    height: 40px;
    margin-bottom: 15px;
    justify-content: space-between;
  `,
  Flags = styled.div`
    display: flex;
    margin: 0 5px;
    justify-content: center;
    align-items: center;
    transform: ${({ active }) => active && `scale(1.3)`};
    cursor: pointer;
    img {
      border: 2px solid ${COLORS.LIGHT};
      border-radius: 2px;
    }
  `,
  Fl = styled.div`
    display: flex;
  `;

export const PoliticPopup = React.memo(({ visible }) => {
  const dispatch = useDispatch();

  const { lng, cities, categories, languages } = useSelector(
    (state) => state.common
  );

  const changeLanguage = (lng) => {
    localStorage.setItem("language", lng);
    dispatch(commonActions.changeLang(lng));
  };

  return (
    <Modal
      open={visible && cities[0] && categories[0]}
      onClose={() => {}}
      showCloseIcon={false}
      styles={{
        modal: {
          borderRadius: "5px",
          background: COLORS.DARK,
          color: COLORS.LIGHT,
        },
      }}
    >
      <Btns>
        <BtnWrap>
          <Btn
            active
            text={txt[lng].politic.accept}
            click={() => {
              localStorage.setItem("isCookPp", true);
              localStorage.setItem("accepted", true);
              dispatch(commonActions.setCookPp(false));
            }}
          />
        </BtnWrap>

        <Fl>
          {languages.map((el) => (
            <Flags
              onClick={() => changeLanguage(el)}
              active={lng === el}
              key={el}
            >
              <Flag code={el} height="15" />
            </Flags>
          ))}
        </Fl>
      </Btns>

      <Left>
        {txt[lng].politic.main}
        <BlockWrap>
          <Block>
            <p>
              {txt[lng].politic.activetxt} {txt[lng].politic.activetxtmain}
            </p>
            <SubBlock>{txt[lng].politic.lang}</SubBlock>
            <SubBlock>{txt[lng].politic.city}</SubBlock>
            <SubBlock>{txt[lng].politic.user}</SubBlock>
          </Block>
          <Active>{txt[lng].politic.active}</Active>
        </BlockWrap>

        <BlockWrap>
          <Block>
            <p>{txt[lng].politic.loc}</p>
          </Block>
          <Active>{txt[lng].politic.insettings}</Active>
        </BlockWrap>
      </Left>
    </Modal>
  );
});
