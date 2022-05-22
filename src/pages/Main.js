import React, { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { mainPlacesActions } from "../store/mainPlaces";
import { commonActions } from "../store/common";
import { geolocationPlacesActions } from "../store/geolocation";
import styled, { keyframes } from "styled-components";
import { IoIosArrowUp } from "react-icons/io";
import { COLORS } from "../other/constants";
import { CompanyBlock, Header, Loader, SearchInput } from "../components";
import { debounce } from "lodash";

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
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    justify-content: space-between;
    width: 1000px;
    margin: 0 auto;
    @media (max-width: 768px) {
      width: 100%;
    }
  `,
  CompanyBlocksContainer = styled.div`
    width: 100%;
    margin-top: 65px;

    @media (max-width: 768px) {
      margin: 65px 0 10px 0;
    }
  `,
  Nothing = styled.div`
    display: flex;
    text-align: center;
    flex: 1;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    text-transform: uppercase;
    animation: ${show} 3s ease;
  `,
  ToTop = styled.div`
    position: fixed;
    bottom: 8px;
    right: 5px;
    cursor: pointer;
    font-size: 25px;
    width: 50px;
    height: 50px;
    background: ${COLORS.DARK};
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2.5px solid ${COLORS.LIGHT_DARK};
    color: ${COLORS.LIGHT};
    opacity: 0.6;
  `,
  Arrow = styled.span`
    padding-top: 3px;
    transition: 0.1s linear padding-bottom;
    ${ToTop}:hover & {
      padding-bottom: 14px;
    }
  `;

export const Main = () => {
  const dispatch = useDispatch();
  const { places, loading, currentPage, fetching, hasMore } = useSelector(
      (state) => state.mainPlaces
    ),
    { currentCityInfo, isLoading, searchString } = useSelector(
      (state) => state.common
    ),
    { geolocation, wasLocationMain } = useSelector(
      (state) => state.geolocation
    );

  const [isToTop, setIsToTop] = useState(false);

  const setFirstQueries = () => dispatch(mainPlacesActions.fetchPlaces()),
    delayed = useCallback(
      debounce(() => {
        dispatch(mainPlacesActions.clearPlaces());
        dispatch(mainPlacesActions.fetchPlaces());
      }, 500),
      []
    ),
    changeText = (text) => {
      dispatch(commonActions.setSearchString(text));
      delayed();
    },
    categoryClick = (id, name) => {
      dispatch(commonActions.setCurrentCategoryInfo({ id, name }));
      dispatch(mainPlacesActions.fetchPlaces());
    },
    cityClick = (id, name, lat, lon) => {
      dispatch(commonActions.setCurrentCityInfo({ id, name, lat, lon }));
      dispatch(mainPlacesActions.fetchPlaces());
    },
    scrollHandler = (e) => {
      if (e.target.documentElement.scrollTop > 500) {
        setIsToTop(true);
      } else {
        setIsToTop(false);
      }

      if (
        e.target.documentElement.scrollHeight -
          (e.target.documentElement.scrollTop + window.innerHeight) <
        200
      ) {
        dispatch(mainPlacesActions.setFetching(true));
      }
    };

  useEffect(() => {
    if (currentCityInfo.id && !wasLocationMain) {
      dispatch(geolocationPlacesActions.getLocation());
      geolocation && setFirstQueries();
    }
  }, [geolocation, currentCityInfo]);

  useEffect(() => {
    wasLocationMain && fetching && hasMore && setFirstQueries(currentPage);
  }, [fetching]);

  useEffect(() => {
    document.title = "for test | Home";
    if (wasLocationMain) {
      dispatch(mainPlacesActions.setCurrentPage(1));
      setFirstQueries();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  return (
    <Container>
      <Header
        filter
        cityBtnClick={cityClick}
        catBtnClick={categoryClick}
        input={
          <SearchInput
            name={""}
            icon
            value={searchString}
            changeText={changeText}
          />
        }
      />

      <CompanyBlocksContainer>
        {places &&
          places[0] &&
          places.map((place) => (
            <CompanyBlock place={place} key={place.alias} />
          ))}

        {places && !places[0] && !loading && !isLoading && (
          <Nothing>
            Nothing found on this page
            <br /> Try to remove any filter in the header of the site
          </Nothing>
        )}
      </CompanyBlocksContainer>

      {(loading || isLoading) && (!fetching || !places[0]) && <Loader />}
      {fetching && loading && places[0] && <Loader bottom={true} />}

      {isToTop && (
        <ToTop onClick={() => window.scrollTo({ top: 0 })}>
          <Arrow>
            <IoIosArrowUp />
          </Arrow>
        </ToTop>
      )}
    </Container>
  );
};
