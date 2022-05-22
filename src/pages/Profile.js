import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { COLORS, txt } from "../other/constants";
import smoothscroll from "smoothscroll-polyfill";
import { AiOutlineClose } from "react-icons/ai";
import { RiSaveLine } from "react-icons/ri";
import _ from "lodash";
import Switch from "react-switch";
import {
  AdminNav,
  Btn,
  Header,
  Loader,
  SearchInput,
  TextArea,
  Popup,
  AdminMap,
  Drop,
  Back,
  QRGenerator,
} from "../components";
import { profileActions } from "../store/profile";
import { commonActions } from "../store/common";
import { useParams, useNavigate, Link } from "react-router-dom";
import { QUERY_PATH } from "../other/settings";
import { DOTS } from "../other/styles";

const Container = styled.div`
    display: flex;
    min-height: 100vh;
    width: 1000px;
    margin: 0 auto;
    @media (max-width: 768px) {
      width: 100%;
    }
  `,
  OneBlock = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: ${COLORS.LIGHT_DARK};
    background: ${COLORS.DARK};
    padding: 10px;
    border-radius: 5px;
    margin: ${({ first }) => (first ? "35px 0" : "45px 0")};
  `,
  Content = styled.div`
    width: 1000px;
    padding-top: 65px;
    @media (max-width: 768px) {
      width: calc(100% - 20px);
      margin: 0 auto;
      padding-top: 60px;
    }
  `,
  FilterWrap = styled.div`
    display: flex;
    z-index: 1;
    &:last-child {
      margin-top: 10px;
    }
  `,
  MainBtns = styled.div`
    display: flex;
    margin-top: 10px;
  `,
  Btns = styled.div`
    height: 50px;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    &:nth-child(1) {
      margin-right: 10px;
    }
    &:nth-child(2) {
    }

    @media (max-width: 768px) {
      flex: 1;
      width: 20%;
      height: 40px;
    }
  `,
  Input = styled.div`
    height: 50px;
    margin-bottom: 10px;
    @media (max-width: 768px) {
      height: 40px;
    }
  `,
  InputSocialWrap = styled.div`
    display: flex;
    height: 50px;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0px;
    }
    @media (max-width: 768px) {
      height: 40px;
    }
  `,
  InputSocial = styled.div`
    display: flex;
    flex: 1;
    margin-right: 10px;
    height: 50px;
    @media (max-width: 768px) {
      height: 40px;
    }
  `,
  MainBtn = styled.div`
    height: 50px;
    display: flex;
    flex: 1;
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
    @media (max-width: 768px) {
      height: 40px;
    }
  `,
  LocationBtn = styled.div`
    height: 50px;
    display: flex;
    flex: 1;
    @media (max-width: 768px) {
      height: 40px;
    }
  `,
  OuterWrap = styled.div`
    position: relative;
    display: flex;
    width: 100%;
    background-color: ${COLORS.LIGHT_DARK};
    height: 110px;
    -webkit-overflow-scrolling: touch;
    padding: 0 10px;
    border-radius: 5px;
    align-items: center;
    @media (max-width: 768px) {
      margin-top: 0;
    }
  `,
  InnerWrap = styled.div`
    display: flex;
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    align-items: center;
    white-space: nowrap;
    height: 100px;
    display: flex;
    align-items: center;
    -webkit-overflow-scrolling: touch;
    &:active {
      cursor: grabbing;
    }
    &::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
      width: 0px;
      position: relative;
    }
    &::-webkit-scrollbar-corner {
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: transparent;
      width: 0px;
    }
  `,
  ImgWrap = styled.div`
    position: relative;
    margin-left: 10px;
    background: ${COLORS.LIGHT_DARK};
    border-radius: 5px;
    width: 160px;
    height: 90px;
    cursor: pointer;
    &:first-child {
      margin-left: 0px;
    }
  `,
  Img = styled.img`
    width: 160px;
    height: 90px;
    overflow: hidden;
    border-radius: 5px;
  `,
  SaveSocial = styled.div`
    display: flex;
    width: 50px;
    background: ${COLORS.LIGHT_DARK};
    cursor: pointer;
    border-radius: 5px;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    color: ${COLORS.SUCCESS_COLOR};
    transition: 0.2s ease opacity;
    &:hover {
      opacity: 0.9;
    }
    @media (max-width: 768px) {
      width: 40px;
    }
  `,
  DelSocial = styled(SaveSocial)`
    color: ${COLORS.ERROR_COLOR};
  `,
  Category = styled(DOTS)`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${COLORS.LIGHT_DARK};
    width: 100%;
    border-radius: 5px;
    text-transform: uppercase;
    color: ${COLORS.LIGHT};
    cursor: pointer;
    @media (max-width: 768px) {
      font-weight: bold;
      font-size: 14px;
    }
  `,
  Cats = styled.div`
    display: flex;
    margin-top: 10px;
    width: 100%;
    flex-wrap: wrap;
  `,
  CatBtn = styled.p`
    cursor: pointer;
    width: calc(50% - 5px);
    display: flex;
    padding: 5px;
    background: ${COLORS.LIGHT_DARK};
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    text-transform: uppercase;
    color: ${({ active }) => active && COLORS.WARNING_COLOR};
    margin-bottom: 10px;
    &:nth-child(2n + 2) {
      margin-right: 0;
    }
  `,
  Field = styled.p`
    text-transform: capitalize;
    position: absolute;
    top: -21px;
    left: 0;
    color: ${COLORS.LIGHT};
    background: ${COLORS.DARK};
    padding: 3px 10px;
    border-radius: 5px 5px 0 0;
  `,
  CheckBoxWrap = styled.div`
    text-align: center;
    text-transform: lowercase;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    background: ${COLORS.LIGHT_DARK};
    width: 100%;
    border-radius: 5px;
    color: ${COLORS.LIGHT};
    position: relative;
    padding: 0 15px;
    line-height: 12px;
    @media (max-width: 768px) {
      font-size: 12px;
    }
  `,
  SwitchStyled = styled(Switch)`
    margin-left: 15px;
  `,
  AddSocial = styled.div`
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background: ${COLORS.LIGHT_DARK};
    height: 50px;
    color: ${COLORS.LIGHT};
    @media (max-width: 768px) {
      height: 40px;
    }
  `;

export const NavBtns = styled.div`
    display: flex;
    justify-content: space-between;
  `,
  ToPlace = styled(Link)`
    display: flex;
    width: 100px;
    align-items: center;
    padding: 15px 0;
    transition: 0.2s ease all;
    font-size: 10px;
    font-weight: bold;
    text-transform: uppercase;
    justify-content: flex-end;
    &:hover {
      opacity: 0.6;
    }
  `,
  PopupImgWrap = styled.div`
    width: 100%;
    height: auto;
  `,
  ImgPPBtns = styled.div`
    display: flex;
    margin-top: 10px;
  `,
  Area = styled.div`
    background: ${COLORS.DARK};
    width: 100%;
    border-radius: 5px;
    margin-top: 10px;
  `,
  Length = styled.div`
    position: absolute;
    top: -9px;
    right: 5px;
    font-size: 12px;
    color: ${COLORS.LIGHT};
  `,
  Limit = styled.span`
    color: ${COLORS.ERROR_COLOR};
  `,
  FirstLim = styled.span`
    color: ${({ maxval }) =>
      maxval ? COLORS.ERROR_COLOR : COLORS.SUCCESS_COLOR};
  `;

export const Profile = () => {
  const dispatch = useDispatch();
  const { alias } = useParams();
  const navigate = useNavigate();
  const slideBtnMenu = useRef(null);

  const { isLoading, cities, categories, lng } = useSelector((st) => st.common),
    {
      loading,
      place,
      isMapPP,
      address,
      coords,
      social,
      isCatPP,
      isCityPP,
      isSwitch,
      isNewSocial,
    } = useSelector((st) => st.profile),
    authState = useSelector((st) => st.auth);

  const supportsTouch = "ontouchstart" in document.documentElement;
  smoothscroll.polyfill();

  const [isDown, setIsDown] = useState(false),
    [startX, setStartX] = useState(),
    [scrollLeft, setScrollLeft] = useState(),
    [activeCat, setActiveCat] = useState(null),
    [isDrag, setIsDrag] = useState(false);

  const changeUrl = (alias) => {
      navigate(`/admin/${alias}/profile`, { replace: true });
    },
    clearImage = () => dispatch(profileActions.setImgSrc(null)),
    save = () => {
      checkValidationError() &&
        dispatch(profileActions.fetchUpdatePlace(changeUrl));
    },
    cityClick = (id) => {
      dispatch(profileActions.fetchUpdateCity(id));
    },
    categoryClick = (id, active) => {
      const length = place.categories.length;
      if (active) {
        if (length !== 1) {
          dispatch(profileActions.fetchUpdateCategory(id, active));
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.cat1 }));
        }
      } else {
        if (length !== 3) {
          dispatch(profileActions.fetchUpdateCategory(id, active));
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.cat3 }));
        }
      }
    },
    tglMapPP = (bool) => {
      dispatch(profileActions.tglMapPP(bool));
      dispatch(profileActions.setAddr(""));
      dispatch(profileActions.setCoords(""));
    },
    tglCatPP = (bool) => {
      dispatch(profileActions.tglCatPP(bool));
    },
    tglCityPP = (bool) => {
      dispatch(profileActions.tglCityPP(bool));
    },
    setNewImage = (data) => {
      !data && setImgDesc("");
      dispatch(profileActions.setNewImage(data));
    },
    checkValidationError = () => {
      if (place.name.length < 1) {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.nameerr }));
        return false;
      } else if (
        (place.alias && !place.alias.match("^[a-zA-Z0-9_]+$")) ||
        place.alias.length < 1 ||
        (!isNaN(place.alias) && place.alias.length)
      ) {
        dispatch(
          commonActions.setErr({
            ownErr: txt[lng].err.aliaserr,
          })
        );
        return false;
      } else {
        dispatch(commonActions.setErr(""));
        return true;
      }
    },
    mouseDownEvent = (e) => {
      setIsDown(true);
      setStartX(e.pageX - slideBtnMenu.current.offsetLeft);
      setScrollLeft(slideBtnMenu.current.scrollLeft);
    },
    mouseMoveEvent = (e) => {
      if (!isDown) {
        setIsDrag(false);
        return;
      }
      setIsDrag(true);
      e.preventDefault();
      const x = e.pageX - slideBtnMenu.current.offsetLeft,
        walk = (x - startX) * 2;
      slideBtnMenu.current.scrollLeft = scrollLeft - walk;
    },
    setImgDesc = (text) => dispatch(profileActions.setImgDesc(text)),
    saveSocial = (id, index, isUpd, isDel) => {
      if (!id) {
        if (!social[index].name || !social[index].url) {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.socialerr }));
        } else {
          dispatch(profileActions.fetchSocial(id, index, isUpd, isDel));
        }
      } else if (isUpd) {
        if (!social[index].name || !social[index].url) {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.socialerr }));
        } else {
          dispatch(profileActions.fetchSocial(id, index, isUpd, isDel));
        }
      } else {
        dispatch(profileActions.fetchSocial(id, index, isUpd, isDel));
      }
    },
    addNew = () => {
      dispatch(profileActions.setIsNewSocial(false));
      dispatch(
        profileActions.setSocial([
          ...social,
          { name: "", url: "", changed: true },
        ])
      );
    },
    smallImageClick = (e, img, i) => {
      if (!isDrag) {
        e.stopPropagation();
        setImgDesc(img.description);
        setNewImage({ img: img, index: i });
      }
    };

  useEffect(() => {
    document.title = "for test | Profile";
    clearImage();
    setNewImage(false);
    dispatch(profileActions.setIsNewSocial(true));
    dispatch(profileActions.fetchPlace(alias));
  }, []);

  useEffect(() => {
    if (place && categories) {
      let active = [];
      categories.forEach((cats) => {
        place.categories.forEach((cur) => {
          _.isEqual(cats, cur) && active.push(cur.id);
        });
      });
      setActiveCat(active);
    }
  }, [place, categories]);

  const isSuper = authState.user.type === "employee";

  return (
    <Container>
      <Header />
      <Content>
        <NavBtns>
          <Back param="/list" />
          {place && !place.disabled && (
            <ToPlace to={`/place/${alias}`}>{txt[lng].profile.toplace}</ToPlace>
          )}
        </NavBtns>

        <AdminNav active="profile" />

        {place && (
          <>
            <OneBlock first>
              <Field>{txt[lng].profile.gallery}</Field>
              <Drop imgcount={place.images.length} />

              {place.images[0] && (
                <OuterWrap>
                  <Length>
                    <FirstLim maxval={place.images.length === 10}>
                      {place.images.length}
                    </FirstLim>
                    /<Limit>10</Limit>
                  </Length>
                  <InnerWrap
                    ref={slideBtnMenu}
                    onMouseDown={(e) => !supportsTouch && mouseDownEvent(e)}
                    onMouseLeave={() => !supportsTouch && setIsDown(false)}
                    onMouseUp={() => !supportsTouch && setIsDown(false)}
                    onMouseMove={(e) => !supportsTouch && mouseMoveEvent(e)}
                  >
                    {place.images.map((img, i) => (
                      <ImgWrap
                        key={img.url}
                        onClick={(e) => smallImageClick(e, img, i)}
                      >
                        <Img
                          src={`${QUERY_PATH}/imgcache/160/90/storage/${img.url}`}
                        />
                      </ImgWrap>
                    ))}
                  </InnerWrap>
                </OuterWrap>
              )}
            </OneBlock>

            <OneBlock>
              <Field>{txt[lng].profile.main}</Field>
              <Input>
                <SearchInput
                  name={"name"}
                  placeholder={`${txt[lng].profile.name}*`}
                  value={place.name}
                  changeText={(e) => dispatch(profileActions.setName(e))}
                />
              </Input>

              <Input>
                <SearchInput
                  name={"alias"}
                  placeholder={`${txt[lng].profile.alias}*`}
                  value={place.alias}
                  changeText={(e) => dispatch(profileActions.setAlias(e))}
                />
              </Input>

              <TextArea
                max={1000}
                placeholder={txt[lng].profile.description}
                value={place.description || ""}
                changeText={(e) => dispatch(profileActions.setDesc(e))}
              />

              <MainBtns>
                <MainBtn>
                  <Btn active text={txt[lng].profile.save} click={save} />
                </MainBtn>
              </MainBtns>
            </OneBlock>

            {isSuper && (
              <OneBlock>
                <Field>QRCode</Field>
                <QRGenerator
                  value={`https://.../place/${place.id}`}
                  id={`https://.../place/${place.id}`}
                  place={place}
                />
              </OneBlock>
            )}

            <OneBlock>
              <Field>{txt[lng].profile.properties}</Field>
              <FilterWrap>
                <Btns>
                  <Category onClick={() => tglCatPP(true)}>
                    {txt[lng].profile.cat}
                  </Category>
                </Btns>
                <Btns>
                  <CheckBoxWrap>
                    <div>{txt[lng].profile.adult}</div>
                    <SwitchStyled
                      checked={!!isSwitch}
                      onChange={(e) =>
                        dispatch(profileActions.fetchUpdateAdult(e))
                      }
                      offColor={COLORS.ERROR_COLOR}
                      onColor={COLORS.SUCCESS_COLOR}
                      height={23}
                      width={46}
                    />
                  </CheckBoxWrap>
                </Btns>
              </FilterWrap>
              <FilterWrap>
                <Btns>
                  <Category onClick={() => tglCityPP(true)}>
                    {txt[lng].profile.cities}
                  </Category>
                </Btns>

                <Btns>
                  <SearchInput
                    name={"addr"}
                    onClick={() => tglMapPP(true)}
                    disabled
                    placeholder={`${txt[lng].profile.address}*`}
                    value={place.address}
                    changeText={() => {}}
                    pointer
                  />
                </Btns>
              </FilterWrap>
            </OneBlock>

            <OneBlock>
              <Field>{txt[lng].profile.contacts}</Field>
              {social.map((el, i) => (
                <InputSocialWrap key={el.id || "newSocial"}>
                  <InputSocial>
                    <SearchInput
                      name={"contacts"}
                      placeholder={txt[lng].profile.title}
                      value={el.name}
                      changeText={(name) =>
                        dispatch(profileActions.updateSocial(i, name, "", true))
                      }
                    />
                  </InputSocial>
                  <InputSocial>
                    <SearchInput
                      name={"data"}
                      placeholder={txt[lng].profile.value}
                      value={el.url}
                      changeText={(url) =>
                        dispatch(profileActions.updateSocial(i, "", url, false))
                      }
                    />
                  </InputSocial>

                  {el.changed ? (
                    <SaveSocial
                      onClick={() =>
                        saveSocial(el.id, i, !el.id ? false : true, false)
                      }
                    >
                      <RiSaveLine size={25} />
                    </SaveSocial>
                  ) : (
                    <DelSocial
                      onClick={() =>
                        saveSocial(el.id, i, false, !el.id ? false : true)
                      }
                    >
                      <AiOutlineClose size={25} />
                    </DelSocial>
                  )}
                </InputSocialWrap>
              ))}

              {isNewSocial && (
                <AddSocial>
                  <Btn active text={txt[lng].profile.addnew} click={addNew} />
                </AddSocial>
              )}
            </OneBlock>
          </>
        )}
      </Content>

      <Popup
        visible={isCatPP}
        header={txt[lng].profile.catmaxmin}
        close={() => tglCatPP(false)}
        content={
          <Cats>
            {activeCat &&
              categories.map((cats) => (
                <CatBtn
                  onClick={() =>
                    categoryClick(cats.id, activeCat.indexOf(cats.id) !== -1)
                  }
                  key={cats.slug}
                  active={activeCat.indexOf(cats.id) !== -1}
                >
                  {cats.name}
                </CatBtn>
              ))}
          </Cats>
        }
      />

      <Popup
        visible={isCityPP}
        header={txt[lng].profile.cities}
        close={() => tglCityPP(false)}
        content={
          <Cats>
            {place &&
              cities &&
              cities.map((city) => (
                <CatBtn
                  onClick={() => cityClick(city.id)}
                  key={city.name}
                  active={place.city.id === city.id}
                >
                  {city.name}
                </CatBtn>
              ))}
          </Cats>
        }
      />

      <Popup
        big={true}
        visible={isMapPP}
        close={() => tglMapPP(false)}
        content={<AdminMap place={place} />}
        footer={
          address &&
          coords && (
            <LocationBtn>
              <Btn
                z={1001}
                text={txt[lng].profile.saveloc}
                click={() => dispatch(profileActions.fetchUpdateCoords())}
              />
            </LocationBtn>
          )
        }
      />

      {(loading || isLoading) && <Loader />}
    </Container>
  );
};
