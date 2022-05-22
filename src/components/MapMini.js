import React from "react";
import styled from "styled-components";
import { COLORS } from "../other/constants";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { Location } from "../other/svg";

const MapContainerStyled = styled(MapContainer)`
  height: 100%;
  width: 100%;
  & {
    .leaflet-control-zoom {
      border: 3px solid ${COLORS.LIGHT};
    }
    .leaflet-control-zoom-in {
      border-bottom: 3px solid ${COLORS.LIGHT};
    }
    .leaflet-control-zoom-in:hover {
      border-bottom: 3px solid ${COLORS.LIGHT};
    }
    .leaflet-control-attribution {
      display: none;
    }
    .leaflet-control-zoom a {
      color: ${COLORS.LIGHT};
    }
    .leaflet-div-icon {
      border: none;
      border-radius: 5px;
      background-color: transparent;
    }

    .marker-cluster {
      background-color: transparent;
    }
    .marker-cluster div {
      background-color: ${COLORS.DARK};
      color: ${COLORS.LIGHT};
      font-weight: bold;
      border: 3px solid ${COLORS.LIGHT};
      border-radius: 50%;
      text-align: center;
    }
  }
`;

export const MapMini = ({ coordinate }) => {
  return (
    <MapContainerStyled
      zoomControl={false}
      className="markercluster-map"
      zoom={19}
      maxNativeZoom={19}
      maxZoom={41}
      minZoom={3}
      center={coordinate}
    >
      <TileLayer
        opacity={1}
        maxNativeZoom={19}
        zoom={19}
        maxZoom={41}
        url="https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png"
      />
      <Marker
        icon={L.divIcon({
          html: renderToStaticMarkup(
            <div>
              {Location(40, 40, COLORS.LIGHT_DARK, COLORS.WARNING_COLOR)}
            </div>
          ),
          iconAnchor: [20, 45],
          iconSize: [40, 40],
          popupAnchor: null,
          shadowSize: [0, 0],
        })}
        position={coordinate}
      />
    </MapContainerStyled>
  );
};
