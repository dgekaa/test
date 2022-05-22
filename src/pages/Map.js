import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  useMapEvent,
} from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { COLORS } from "../other/constants";
import { CustomMarker, Header, Loader, SearchInput } from "../components";
import { renderToStaticMarkup } from "react-dom/server";
import { mapPlacesActions } from "../store/mapPlaces";
import { commonActions } from "../store/common";
import { geolocationPlacesActions } from "../store/geolocation";
import { Location } from "../other/svg";
import { debounce } from "lodash";
import { mainPlacesActions } from "../store/mainPlaces";
import { isMobile } from "react-device-detect";
import styled, { keyframes } from "styled-components";

const show = keyframes`
  from {
    opacity:0
  }
  to {
    opacity:1;
  }
`;

const Container = styled.div`
    background-color: ${COLORS.LIGHT_DARK};
    height: 100vh;
  `,
  MapWrap = styled.div`
    position: fixed;
    top: 0;
    width: 130%;
    height: 120vh;
    margin-left: -15%;
    @media (max-width: 760px) {
      position: fixed;
      top: 105px;
      height: calc(100% - 30px);
    }
  `,
  MapContainerStyled = styled(MapContainer)`
    height: 125%;
    top: -80px;
    & {
      .leaflet-control-zoom {
        border: 3px solid ${COLORS.LIGHT_DARK};
        position: fixed;
        bottom: 40px;
        right: 10px;
        margin: 0;
        padding: 0;
      }
      .leaflet-control-zoom-in {
        border-bottom: 3px solid ${COLORS.LIGHT_DARK};
      }
      .leaflet-control-zoom-in:hover {
        border-bottom: 3px solid ${COLORS.LIGHT_DARK};
      }
      .leaflet-control-attribution {
        display: none;
      }
      .leaflet-control-zoom a {
        color: ${COLORS.LIGHT_DARK};
        &:first-child {
          line-height: 27px;
        }
      }
      .marker-cluster {
        background-color: ${COLORS.LIGHT_DARK};
      }
      .marker-cluster div {
        background-color: ${COLORS.DARK};
        color: ${COLORS.LIGHT};
        font-weight: bold;
      }
      .leaflet-div-icon {
        border: none;
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0);
      }
    }
  `,
  ToLocation = styled.div`
    width: 35px;
    height: 35px;
    background-color: #fff;
    border: 3px solid ${COLORS.LIGHT_DARK};
    z-index: 1000;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: fixed;
    bottom: 120px;
    right: 10px;
    &:hover {
      box-shadow: 0 0 30px 10px #eee inset;
    }
  `,
  Nothing = styled.div`
    display: flex;
    text-align: center;
    flex: 1;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    position: absolute;
    top: 90px;
    z-index: 500;
    width: 60%;
    left: 20%;
    animation: ${show} 3s ease;
    @media (max-width: 768px) {
      width: 80%;
      left: 10%;
    }
  `;

const Events = ({ changeUrl, id, name }) => {
  useMapEvent("dragend", ({ target }) => {
    changeUrl(target._zoom, target.getCenter(), id, name);
  });

  useMapEvent("zoom", ({ target }) => {
    changeUrl(target._zoom, target.getCenter(), id, name);
  });

  return null;
};

export const Map = React.memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { places, loading, isWorking } = useSelector(
      (state) => state.mapPlaces
    ),
    { currentCityInfo, isLoading, searchString } = useSelector(
      (state) => state.common
    ),
    { geolocation, wasLocationMain } = useSelector(
      (state) => state.geolocation
    );

  const [mapRef, setMapRef] = useState(null);

  const { ll, z, id, name } = useParams();

  const coordinate = [ll.split(";")[0], ll.split(";")[1]];

  const setFirstQueries = () => dispatch(mapPlacesActions.fetchPlaces()),
    delayed = useCallback(
      debounce(() => {
        dispatch(mainPlacesActions.clearPlaces());
        dispatch(mapPlacesActions.fetchPlaces());
      }, 500),
      []
    ),
    changeText = (text) => {
      dispatch(commonActions.setSearchString(text));
      delayed();
    },
    categoryClick = (id, name) => {
      dispatch(commonActions.setCurrentCategoryInfo({ id, name }));
      dispatch(mapPlacesActions.fetchPlaces());
    },
    cityClick = (id, name, lat, lon) => {
      navigate(`/map/${lat + ";" + lon}/12/${id}/${name}`, { replace: true });
      mapRef.flyTo([lat, lon], 12, {
        animate: true,
        duration: 1,
      });
      dispatch(commonActions.setCurrentCityInfo({ id, name, lat, lon }));
      dispatch(mapPlacesActions.fetchPlaces());
    },
    flyToLocation = () => {
      mapRef.flyTo([geolocation.latitude, geolocation.longitude], 13, {
        animate: true,
        duration: 1,
      });
    },
    changeUrl = useCallback(
      debounce((zoom, { lat, lng }, id, name) => {
        decodeURIComponent(window.location.pathname).split("/")[1] === "map" &&
          window.history.replaceState(
            "",
            "",
            `/map/${lat + ";" + lng}/${zoom}/${id}/${name}`
          );
      }, 800),
      []
    );

  useEffect(() => {
    if (currentCityInfo.id && !wasLocationMain) {
      dispatch(geolocationPlacesActions.getLocation());
      geolocation && setFirstQueries();
    }
  }, [geolocation, currentCityInfo]);

  useEffect(() => {
    wasLocationMain && setFirstQueries();
    document.title = `for test | Map`;
  }, []);

  return (
    <Container>
      <Header
        filter
        cityBtnClick={cityClick}
        catBtnClick={categoryClick}
        working={{
          isWorking,
          change: () => dispatch(mapPlacesActions.fetchPlaces(true)),
        }}
        input={
          <SearchInput
            name={""}
            icon
            value={searchString}
            changeText={changeText}
          />
        }
      />
      <MapWrap>
        <MapContainerStyled
          zoomControl={false}
          className="markercluster-map"
          zoom={z}
          maxNativeZoom={19}
          maxZoom={22}
          minZoom={12}
          center={coordinate}
          whenCreated={(mapInstance) => setMapRef(mapInstance)}
        >
          <Events changeUrl={changeUrl} id={id} name={name} />
          <TileLayer
            opacity={1}
            maxNativeZoom={19}
            zoom={12}
            maxZoom={22}
            minZoom={12}
            url="https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png"
          />

          {geolocation && geolocation.latitude && (
            <Marker
              zIndexOffset={1000}
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
              position={[geolocation.latitude, geolocation.longitude]}
            />
          )}

          <MarkerClusterGroup
            showCoverageOnHover={false}
            maxClusterRadius={isMobile ? 160 : 130}
            spiderLegPolylineOptions={{
              weight: 0,
              opacity: 0,
            }}
            spiderfyDistanceMultiplier={5}
            spiderfyOnMaxZoom={isMobile ? false : true}
          >
            {places.map((place) => (
              <CustomMarker place={place} key={place.alias} />
            ))}
          </MarkerClusterGroup>

          <ZoomControl position={"bottomright"} />
          {geolocation && geolocation.latitude && (
            <ToLocation onClick={flyToLocation}>
              {Location(25, 25, COLORS.LIGHT_DARK, "#fff")}
            </ToLocation>
          )}
        </MapContainerStyled>
      </MapWrap>

      {places && !places[0] && !loading && !isLoading && (
        <Nothing>
          Nothing found on this page
          <br /> Try to remove any filter in the header of the site
        </Nothing>
      )}
      {(loading || isLoading) && <Loader />}
    </Container>
  );
});
