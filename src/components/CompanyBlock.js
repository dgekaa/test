import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { commonActions } from "../store/common";
import { COLORS, txt } from "../other/constants";
import {
  getWorkTime,
  isOnline,
  getProfileUserImage,
  isBlur,
} from "../other/functions";
import { DOTS } from "../other/styles";
import { useSelector, useDispatch } from "react-redux";
import { mapPlacesActions } from "../store/mapPlaces";

const show = keyframes`
  from {
    opacity:0
  }
  to {
    opacity:1;
  }
`;

const Container = styled.div`
    animation: ${show} 1s ease;
    background-color: ${COLORS.DARK};
    height: 200px;
    width: 320px;
    border-radius: 5px;
    margin: 10px;
    margin-left: 0;
    margin-right: 0;
    overflow: hidden;
    color: ${COLORS.LIGHT};
    box-shadow: 2px 2px 8px 0px #000;
    cursor: pointer;
    position: relative;
    display: inline-block;
    &:nth-child(3n + 2) {
      margin-left: 20px;
      margin-right: 20px;
    }

    &:nth-child(3n + 3) {
      margin-left: 0;
      margin-right: 0;
    }
    @media (max-width: 768px) {
      &:nth-child(2n + 2) {
        margin-left: 5px;
        margin-right: 5px;
      }
      &:nth-child(2n + 3) {
        margin-left: 5px;
        margin-right: 5px;
      }
      &:nth-child(3n + 2) {
        margin-left: 5px;
        margin-right: 5px;
      }
      &:nth-child(3n + 3) {
        margin-left: 5px;
        margin-right: 5px;
      }
      width: calc(50% - 10px);
      margin: 5px;
      margin-top: 2.5px;
      margin-bottom: 2.5px;
    }

    @media (max-width: 500px) {
      &:nth-child(2n + 2) {
        margin-left: 10px;
        margin-right: 10px;
      }
      &:nth-child(2n + 3) {
        margin-left: 10px;
        margin-right: 10px;
      }
      &:nth-child(3n + 2) {
        margin-left: 10px;
        margin-right: 10px;
      }
      &:nth-child(3n + 3) {
        margin-left: 10px;
        margin-right: 10px;
      }
      width: calc(100% - 20px);
      margin: 5px;
      margin-left: 10px;
      margin-right: 10px;
    }
  `,
  TopBlock = styled.div`
    background-color: #000;
    overflow: hidden;
  `,
  VideoContainer = styled.div`
    height: 200px;
    width: 100%;
    background-image: ${({ src }) => src};
    filter: ${({ blur }) => `blur(${blur / 20}px)`};
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  `,
  Name = styled(DOTS)`
    font-size: 18px;
    font-weight: bold;
  `,
  DescriptionContainer = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    box-shadow: 0 0 200px 70px ${COLORS.DARK} inset;
    transition: 0.3s transform;
    transform: ${({ open }) =>
      open ? "translate(0, 0)" : "translate(0, 169px)"};
  `,
  NameWrap = styled.div`
    font-size: 18px;
    padding: 5px;
    border-bottom: 1px solid ${COLORS.LIGHT};
    display: flex;
    justify-content: space-between;
    cursor: auto;
  `,
  Text = styled(DOTS)`
    font-size: 16px;
    font-weight: normal;
    font-weight: bold;
    padding: 5px;
  `,
  Address = styled.span`
    &:hover {
      text-decoration: underline;
    }
    @media (max-width: 768px) {
      text-decoration: underline;
    }
  `,
  Label = styled.span`
    font-weight: normal;
    padding-right: 5px;
    text-transform: capitalize;
  `,
  Online = styled.div``,
  Cat = styled.span`
    margin-right: 5px;
  `;

export const CompanyBlock = React.memo(
  ({
    place: {
      name,
      images,
      streams,
      address,
      alias,
      categories,
      lat,
      lon,
      currentScheduleInterval,
      is_work,
      distance,
      city,
    },
  }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);

    const { lng } = useSelector((state) => state.common);

    const toCompany = (e) => {
        e.stopPropagation();
        navigate(`/place/${alias}`);
      },
      toMap = (e) => {
        e.stopPropagation();
        dispatch(mapPlacesActions.setIsWorking(false));
        dispatch(
          commonActions.setCurrentCityInfo({
            id: city.id,
            name: city.name,
            lat: city.lat,
            lon: city.lon,
          })
        );
        dispatch(
          commonActions.setCurrentCategoryInfo({ id: null, name: null })
        );
        dispatch(commonActions.setSearchString(""));
        navigate(`/map/${lat};${lon}/20/${city.id}/${city.name}`);
      },
      clickDesc = (e) => {
        e.stopPropagation();
        setOpen((prev) => !prev);
      };

    return (
      <Container>
        <TopBlock onClick={toCompany}>
          <VideoContainer
            blur={isBlur(streams)}
            src={getProfileUserImage(images, streams, 320, 200)}
          />
        </TopBlock>

        <DescriptionContainer
          open={open}
          onClick={toCompany}
          onMouseEnter={clickDesc}
          onMouseLeave={clickDesc}
        >
          <NameWrap onClick={clickDesc}>
            <Name>{name}</Name>
            {isOnline(streams) && <Online>{txt[lng].block.online}</Online>}
          </NameWrap>
          <Text>
            <Label>{txt[lng].block.type}:</Label>
            {categories.map((cat) => (
              <Cat key={cat.name}>{cat.name}</Cat>
            ))}
          </Text>
          <Text>
            <Label>{txt[lng].block.hours}:</Label>
            {getWorkTime(is_work, currentScheduleInterval)}
          </Text>
          {distance && (
            <Text>
              <Label>{txt[lng].block.distance}:</Label>
              {`${distance.toFixed(1)} ${txt[lng].block.km}`}
            </Text>
          )}
          <Text>
            <Label>{txt[lng].block.address}:</Label>
            <Address onClick={toMap}>{address}</Address>
          </Text>
        </DescriptionContainer>
      </Container>
    );
  }
);
