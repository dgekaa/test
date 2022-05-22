import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { COLORS, G_API_KEY, LANG, REG } from "../other/constants";
import { useDispatch } from "react-redux";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { Location } from "../other/svg";
import "leaflet-geosearch/dist/geosearch.css";
import Geocode from "react-geocode";
import { GeoSearchControl, GoogleProvider } from "leaflet-geosearch";
import { profileActions } from "../store/profile";

const MapContainerStyled = styled(MapContainer)`
    border-radius: 7px;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    position: absolute;
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
      .leaflet-control-geosearch input {
        font-size: 16px;
        height: 45px !important;
        width: 100% !important;
      }
      .leaflet-control-geosearch,
      .leaflet-control-geosearch ul {
        border-radius: 5px;
        padding: 5px;
        height: 45px !important;
        width: 120% !important;
      }
      a.reset {
        display: none;
      }
      .leaflet-touch .leaflet-geosearch-bar form {
        border: 1px solid rgb(211, 211, 211);
        border-radius: 10px;
        overflow: hidden;
      }
      .leaflet-control-geosearch form {
        padding: 0;
      }
      .leaflet-control-geosearch .results.active {
        padding: 0;
        border: none;
        height: 45px;
        display: flex;
        align-items: center;
      }
      .leaflet-touch .leaflet-geosearch-bar form input {
        height: 50px;
      }
      .leaflet-container {
        font-size: 14px;
      }
      .leaflet-control-geosearch .results.active div {
        border-top: 1px solid rgb(211, 211, 211);
        height: 45px;
        display: flex;
        align-items: center;
        width: 100%;
      }

      @media screen and (max-width: 760px) {
        .leaflet-control-geosearch,
        .leaflet-control-geosearch ul {
          margin: 10px 0 0 10px;
        }
        .leaflet-touch .leaflet-geosearch-bar form {
          width: calc(100vw - 30px);
          top: 0px;
        }
      }
    }
  `,
  Center = styled.div`
    position: absolute;
    z-index: 1100;
    top: calc(50% - 5px);
    left: calc(50% - 5px);
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: ${COLORS.SUCCESS_COLOR};
  `;

export const AdminMap = ({ place }) => {
  const [mapRef, setMapRef] = useState(null);

  const dispatch = useDispatch();

  const getAddressFromCoord = (lat, lng) => {
    Geocode.fromLatLng(lat, lng).then(
      (response) => {
        const address = response.results[0].formatted_address;

        dispatch(profileActions.setCoords({ lat, lon: lng }));
        dispatch(profileActions.setAddr(address));

        mapRef._controlContainer.childNodes[4].querySelector("input").value =
          address;
      },
      (error) => console.error(error)
    );
  };

  useEffect(() => {
    if (!mapRef) return;

    const provider = new GoogleProvider({
        params: {
          key: G_API_KEY,
          language: LANG,
          region: REG,
        },
      }),
      control = new GeoSearchControl({
        provider,
        style: "bar",
        showMarker: false,
      });

    mapRef.addControl(control);

    mapRef.on("geosearch/showlocation", (data) => {
      const { x, y, label } = data.location;

      dispatch(profileActions.setCoords({ lat: y, lon: x }));
      dispatch(profileActions.setAddr(label));
    });

    Geocode.setApiKey(G_API_KEY);
    Geocode.setLanguage(LANG);
    Geocode.setRegion(REG);
    Geocode.setLocationType("ROOFTOP"); // ROOFTOP, RANGE_INTERPOLATED, GEOMETRIC_CENTER, APPROXIMATE
    Geocode.enableDebug();

    mapRef.on("dragend", (e) =>
      getAddressFromCoord(mapRef.getCenter().lat, mapRef.getCenter().lng)
    );

    mapRef.on("zoomend", (e) =>
      getAddressFromCoord(mapRef.getCenter().lat, mapRef.getCenter().lng)
    );
  }, [mapRef]);

  return (
    <div>
      <MapContainerStyled
        zoomControl={false}
        className="markercluster-map"
        zoom={19}
        maxNativeZoom={19}
        maxZoom={41}
        minZoom={3}
        center={[place.lat, place.lon]}
        whenCreated={(mapInstance) => setMapRef(mapInstance)}
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
          position={[place.lat, place.lon]}
        />
      </MapContainerStyled>
      <Center />
    </div>
  );
};
