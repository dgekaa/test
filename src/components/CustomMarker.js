import React from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";
import styled from "styled-components";
import { renderToStaticMarkup } from "react-dom/server";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../other/constants";
import { isOnline, getProfileUserImage, isBlur } from "../other/functions";
import { DOTS } from "../other/styles";
import { isMobile } from "react-device-detect";
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";

const MarkerWrap = styled.div`
    width: 120px;
    height: 88px;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    background-color: ${COLORS.DARK};
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 87px;
      left: 50px;
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-bottom: 0;
      border-top-color: ${COLORS.DARK};
    }
    @media (max-width: 768px) {
      height: ${({ isMobile }) => isMobile && "132px"};
      width: ${({ isMobile }) => isMobile && "180px"};
      &::after {
        top: ${({ isMobile }) => isMobile && "131px"};
        left: ${({ isMobile }) => isMobile && "80px"};
      }
    }
  `,
  ImageBlock = styled.div`
    filter: ${({ blur }) => `blur(${blur / 20}px)`};
    height: 68px;
    background-image: ${({ src }) => src};
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-color: ${COLORS.DARK};
    border-radius: 5px 5px 0 0;
    @media (max-width: 768px) {
      height: ${({ isMobile }) => isMobile && "110px"};
    }
  `,
  DescBlock = styled.div`
    color: ${COLORS.LIGHT};
    display: flex;
    flex: 1;
    justify-content: space-between;
    padding: 0 5px;
    align-items: center;
  `,
  Name = styled(DOTS)`
    font-weight: bold;
  `,
  Online = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    background-color: ${COLORS.DARK};
    color: ${COLORS.LIGHT};
    border-radius: 5px 0 5px 0;
    padding: 2px 3px 0 3px;
    font-size: 14px;
    line-height: 14px;
  `;

export const CustomMarker = ({
  place: { lat, lon, name, images, streams, alias },
}) => {
  const navigate = useNavigate();

  return (
    <Marker
      eventHandlers={{
        click: (e) => navigate(`/place/${alias}`),
      }}
      icon={L.divIcon({
        html: renderToStaticMarkup(
          <MarkerWrap isMobile={isMobile}>
            <ImageBlock
              blur={isBlur(streams)}
              isMobile={isMobile}
              src={getProfileUserImage(images, streams, 120, 68)}
            />

            <Online>
              {isOnline(streams) ? <BsCameraVideo /> : <BsCameraVideoOff />}
            </Online>

            <DescBlock>
              <Name>{name}</Name>
            </DescBlock>
          </MarkerWrap>
        ),
        iconAnchor: [isMobile ? 90 : 60, isMobile ? 142 : 98],
        iconSize: [isMobile ? 180 : 120, isMobile ? 132 : 88],
        popupAnchor: null,
        shadowSize: [0, 0],
      })}
      position={[lat, lon]}
    />
  );
};
