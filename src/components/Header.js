import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { COLORS, txt } from "../other/constants";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../other/svg";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  MdOutlineSearchOff,
  MdOutlineSearch,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { sidebarActions } from "../store/sidebar";
import { useSelector, useDispatch } from "react-redux";
import { commonActions } from "../store/common";
import Flag from "react-world-flags";
import { mainPlacesActions } from "../store/mainPlaces";
import { Checkbox } from "./Checkbox";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`,
  fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const fadeIn1 = keyframes`
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`,
  fadeOut1 = keyframes`
  from {
    transform: scale(1);
    opacity:1;
  }
  to {
    transform: scale(0.5);
    opacity: 0;
  }
`;

const Container = styled.div`
    width: 100%;
    height: 65px;
    position: fixed;
    top: 0;
    left: 0;
    background-color: ${COLORS.DARK};
    border-bottom: 3px solid ${COLORS.LIGHT};
    z-index: 1000;
    @media (max-width: 768px) {
      width: 100%;
      height: 60px;
    }
  `,
  InnerContainer = styled.div`
    width: 1000px;
    height: 65px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media (max-width: 768px) {
      width: 100%;
      height: 60px;
    }
  `,
  LogoWrap = styled(Link)`
    height: 100%;
    display: flex;
    align-items: center;
    @media (max-width: 768px) {
      margin-left: 7px;
      padding-bottom: 3px;
    }
  `,
  Burger = styled(GiHamburgerMenu)`
    display: none;
    @media (max-width: 768px) {
      height: 100%;
      display: block;
      font-size: 40px;
      cursor: pointer;
      color: ${COLORS.LIGHT};
      margin-right: 8px;
      padding-bottom: 3px;
    }
  `,
  InputDesc = styled.div`
    width: 300px;
    height: 35px;
    @media (max-width: 768px) {
      display: none;
    }
  `,
  InputMob = styled.div`
    display: none;
    @media (max-width: 768px) {
      display: flex;
      position: absolute;
      height: 35px;
      flex: 1;
      width: calc(100% - 35px);
      transition: 0.3s ease all;
      opacity: ${({ search }) => (search ? 1 : 0.8)};
      transform: ${({ search }) =>
        search ? "translateY(0px)" : "translateY(-50px)"};
    }
  `,
  DrDouns = styled.div`
    display: flex;
    height: 100%;
    @media (max-width: 768px) {
      height: 100%;
      width: calc(100% - 6px);
      justify-content: space-between;
      align-items: center;
      padding-bottom: 3px;
      position: relative;
    }
  `,
  DrDoun = styled.div`
    position: relative;
    display: flex;
    height: 100%;
    margin-right: 35px;
    align-items: center;
    width: 100%;
    @media (max-width: 768px) {
      margin-right: 0;
      width: 100%;
    }
  `,
  DrDounLng = styled.div`
    position: relative;
    display: flex;
    height: 100%;
    align-items: center;
    width: 100%;
  `,
  Filter = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35px;
    border-radius: 5px;
    flex: 1;
    text-transform: uppercase;
    cursor: pointer;
    padding: 0 10px;
    color: ${({ chosen }) => (chosen ? COLORS.WARNING_COLOR : COLORS.LIGHT)};
    @media (max-width: 768px) {
      background-color: ${COLORS.LIGHT_DARK};
      margin-right: 5px;
    }
  `,
  MobileLngDD = styled.div`
    display: none;
    @media (max-width: 768px) {
      display: flex;
      flex: 1;
      margin-left: 5px;
    }
  `,
  FilterLng = styled(Filter)`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 0 0 10px;
    color: ${COLORS.LIGHT};
  `,
  FilterBtn = styled.div``,
  Arrow = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    transition: 0.3s ease transform;
    transform: ${({ isFilter }) =>
      isFilter ? `rotate(180deg)` : `rotate(0deg)`};
  `,
  FilterOuter = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    visibility: ${(props) => (props.isFilter ? "visible" : "hidden")};
    animation: ${(props) => (props.isFilter ? fadeIn : fadeOut)} 0.3s ease;
    transition: visibility 0.3s ease;
    z-index: 1001;
  `,
  FilterHidden = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 55px;
    background: ${COLORS.LIGHT_DARK};
    padding: 10px;
    border-radius: 5px;
    box-shadow: 2px 2px 8px 0px #000;
    color: ${COLORS.LIGHT};
    width: 500px;
    visibility: ${(props) => (props.isFilter ? "visible" : "hidden")};
    animation: ${(props) => (props.isFilter ? fadeIn1 : fadeOut1)} 0.3s ease;
    transition: visibility 0.3s ease;
    z-index: 1002;
    @media (max-width: 768px) {
      top: 65px;
      width: calc(100% + 35px);
    }
  `,
  FilterHiddenLng = styled(FilterHidden)`
    width: auto;
    visibility: ${(props) => (props.isFilter ? "visible" : "hidden")};
    animation: ${(props) => (props.isFilter ? fadeIn1 : fadeOut1)} 0.3s ease;
    transition: visibility 0.3s ease;
    right: 5px;
    @media (max-width: 768px) {
      top: 55px;
      width: auto;
    }
  `,
  OneFilter = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    align-items: flex-start;
    &:last-child {
      margin-bottom: 0;
    }
  `,
  Name = styled.div`
    text-transform: capitalize;
  `,
  List = styled.div`
    display: flex;
    flex-wrap: wrap;
  `,
  ListBtn = styled.div`
    display: flex;
    padding: 7px 10px;
    background: ${COLORS.DARK};
    border-radius: 5px;
    margin-right: 10px;
    margin-top: 10px;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 12px;
    line-height: 12px;
    border: ${({ active }) =>
      active ? `2px solid ${COLORS.LIGHT}` : "2px solid transparent"};
    &:last-child {
      margin-right: 0;
    }
    transition: 0.2s ease opacity;
    &:hover {
      opacity: 0.8;
    }
  `,
  NavContainer = styled.div`
    height: 100%;
    color: ${COLORS.LIGHT};
    display: flex;
    align-items: center;
    text-transform: uppercase;
    @media (max-width: 768px) {
      display: none;
    }
  `,
  Lng = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    &:first-child {
      margin-top: 0px;
    }
    transition: 0.2s ease opacity;
    &:hover {
      opacity: 0.7;
    }
  `,
  LngIcon = styled(Flag)`
    width: 20px;
  `,
  LangText = styled.p`
    margin-left: 10px;
    width: 100%;
    font-size: 14px;
  `,
  NavBtn = styled(Link)`
    color: ${COLORS.LIGHT};
    display: flex;
    align-items: center;
    padding: 8px;
    cursor: pointer;
    border-bottom: 2px solid ${COLORS.DARK};
    &:hover {
      border-bottom: 2px solid ${COLORS.LIGHT};
      padding-bottom: 12px;
      transition: 0.2s ease-in-out all;
    }
  `,
  MapBtn = styled.div`
    color: ${COLORS.LIGHT};
    display: flex;
    align-items: center;
    padding: 8px;
    cursor: pointer;
    border-bottom: 2px solid ${COLORS.DARK};
    &:hover {
      border-bottom: 2px solid ${COLORS.LIGHT};
      padding-bottom: 12px;
      transition: 0.2s ease-in-out all;
    }
  `,
  Filters = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    @media (max-width: 768px) {
      flex: 1;
      flex-direction: column;
    }
  `,
  SearchStyle = styled.div`
    display: none;
    @media (max-width: 768px) {
      display: flex;
      width: 35px;
      height: 35px;
      background: ${COLORS.LIGHT_DARK};
      border-radius: 5px;
      margin-left: 5px;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      font-size: 25px;
      color: ${COLORS.LIGHT};
      position: relative;
      &::before {
        content: "";
        position: absolute;
        right: 3px;
        top: 3px;
        border-radius: 50%;
        width: 6px;
        height: 6px;
        background-color: ${({ search }) =>
          search ? COLORS.WARNING_COLOR : "transparent"};
      }
    }
  `,
  PlaceName = styled.div`
    height: 100%;
    width: 100%;
    margin-left: 20px;
    display: flex;
    align-items: center;
    color: ${COLORS.LIGHT};
    text-transform: uppercase;
    font-weight: bold;
    @media (max-width: 768px) {
      width: auto;
      margin-left: 0;
      font-size: 14px;
    }
  `,
  IsWork = styled.div`
    font-weight: normal;
    margin-left: 5px;
    font-size: 12px;
    @media (max-width: 768px) {
      font-size: 10px;
    }
  `;

const LngDDoun = () => {
  const dispatch = useDispatch();
  const { lng, languages, languagesText } = useSelector(
    (state) => state.common
  );

  const [isLang, setIsLang] = useState(false);

  const changeLng = (el) => {
      changeLanguage(el);
      toggleLang(false);
    },
    changeLanguage = (lng) => {
      localStorage.setItem("language", lng);
      dispatch(commonActions.changeLang(lng));
    },
    toggleLang = (bool) => {
      setIsLang(bool);
    };

  return (
    <DrDounLng>
      <FilterLng onClick={() => toggleLang(true)}>
        <FilterBtn>
          <LngIcon code={lng} height={14} />
        </FilterBtn>
        <Arrow isFilter={isLang}>
          <MdKeyboardArrowDown />
        </Arrow>
      </FilterLng>

      <FilterOuter isFilter={isLang} onClick={() => toggleLang(false)} />
      <FilterHiddenLng isFilter={isLang}>
        {languages.map(
          (el, i) =>
            lng !== el && (
              <Lng onClick={() => changeLng(el)} key={el}>
                <LngIcon code={el} height={14} />
                <LangText>{languagesText[i]}</LangText>
              </Lng>
            )
        )}
      </FilterHiddenLng>
    </DrDounLng>
  );
};

export const Header = ({
  input,
  filter,
  cityBtnClick,
  catBtnClick,
  working,
  name,
  isWork,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth),
    {
      currentCityInfo,
      currentCategoryInfo,
      searchString,
      isMobSearch,
      cities,
      categories,
      lng,
    } = useSelector((state) => state.common);

  const [isFilter, setIsFilter] = useState(false),
    [chosen, setChosen] = useState(false);

  const toMap = () => {
      const { id, lon, lat, name } = currentCityInfo;
      navigate(`/map/${lat + ";" + lon}/12/${id}/${name}`);
    },
    searchClick = () => {
      dispatch(commonActions.setIsMobSearch(!isMobSearch));
    },
    toggleFilter = (bool) => {
      setIsFilter(bool);
    },
    cityClick = ({ id, name, lat, lon }) => {
      localStorage.setItem("city", JSON.stringify({ id, name, lat, lon }));
      dispatch(mainPlacesActions.clearPlaces());
      cityBtnClick(id, name, lat, lon);
    },
    catClick = ({ id, name }) => {
      dispatch(mainPlacesActions.clearPlaces());
      id && name ? catBtnClick(id, name) : catBtnClick(null);
    };

  useEffect(() => {
    if (isFilter) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isFilter]);

  useEffect(() => {
    if (currentCategoryInfo.id || (working && working.isWorking)) {
      setChosen(true);
    } else {
      setChosen(false);
    }
  }, [currentCategoryInfo, working]);

  return (
    <Container>
      {cities[0] && categories[0] && (
        <InnerContainer>
          <LogoWrap to="/">{Logo(40, 40, COLORS.LIGHT, true)}</LogoWrap>

          {name && (
            <PlaceName>
              {name}{" "}
              <IsWork>
                {" "}
                {isWork ? <>&#9679; opened</> : <>&#9679; closed</>}
              </IsWork>
            </PlaceName>
          )}

          {filter && (
            <Filters>
              <DrDouns>
                <DrDoun>
                  <Filter onClick={() => toggleFilter(true)} chosen={chosen}>
                    <FilterBtn>{txt[lng].header.filters}</FilterBtn>
                    <Arrow isFilter={isFilter}>
                      <MdKeyboardArrowDown />
                    </Arrow>
                  </Filter>

                  <MobileLngDD>
                    <LngDDoun />
                  </MobileLngDD>

                  <FilterOuter
                    isFilter={isFilter}
                    onClick={() => toggleFilter(false)}
                  />
                  <FilterHidden isFilter={isFilter}>
                    {cityBtnClick && (
                      <OneFilter>
                        <Name>{txt[lng].header.cities}</Name>
                        <List>
                          {cities.map((city) => (
                            <ListBtn
                              active={currentCityInfo.id === city.id}
                              onClick={() => cityClick(city)}
                              key={city.name}
                            >
                              {city.name}
                            </ListBtn>
                          ))}
                        </List>
                      </OneFilter>
                    )}

                    {catBtnClick && (
                      <OneFilter>
                        <Name>{txt[lng].header.categories}</Name>
                        <List>
                          <ListBtn
                            active={!currentCategoryInfo.id}
                            onClick={() => catClick({ id: "" })}
                          >
                            {txt[lng].header.allDd}
                          </ListBtn>
                          {categories.map((cat) => (
                            <ListBtn
                              active={currentCategoryInfo.id === cat.id}
                              onClick={() => catClick(cat)}
                              key={cat.name}
                            >
                              {cat.name}
                            </ListBtn>
                          ))}
                        </List>
                      </OneFilter>
                    )}

                    {working && (
                      <OneFilter>
                        <Name>
                          <Checkbox
                            label={txt[lng].map.working}
                            value={working.isWorking}
                            checked={working.isWorking}
                            onChange={() => working.change()}
                          />
                        </Name>
                      </OneFilter>
                    )}
                  </FilterHidden>
                </DrDoun>

                {input && <InputMob search={isMobSearch}>{input}</InputMob>}

                {input && (
                  <SearchStyle search={searchString} onClick={searchClick}>
                    {isMobSearch ? <MdOutlineSearchOff /> : <MdOutlineSearch />}
                  </SearchStyle>
                )}
              </DrDouns>

              {input && <InputDesc>{input}</InputDesc>}
            </Filters>
          )}

          {currentCityInfo.id ? (
            <NavContainer>
              {(!!currentCityInfo.lat || currentCityInfo.lat === 0) && (
                <MapBtn onClick={toMap}>{txt[lng].header.map}</MapBtn>
              )}

              <NavBtn to="/info">{txt[lng].header.info}</NavBtn>

              {isAuthenticated ? (
                <NavBtn to="/list">{txt[lng].header.profile}</NavBtn>
              ) : (
                <NavBtn to="/login">{txt[lng].header.login}</NavBtn>
              )}

              <LngDDoun />
            </NavContainer>
          ) : (
            <NavContainer></NavContainer>
          )}

          <Burger
            input={input}
            onClick={() => dispatch(sidebarActions.showSidebar())}
          />
        </InnerContainer>
      )}
    </Container>
  );
};
