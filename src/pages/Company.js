import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import { companyPlaceActions } from "../store/companyPlace";
import { COLORS, txt } from "../other/constants";
import { QUERY_PATH } from "../other/settings";
import { Btn, Header, Loader, VideoPlayer, Popup } from "../components";
import { useParams, useNavigate } from "react-router-dom";
import { getWorkTime } from "../other/functions";
import { DOTS } from "../other/styles";
import { commonActions } from "../store/common";
import { Carousel } from "react-responsive-carousel";
import { mapPlacesActions } from "../store/mapPlaces";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export const Container = styled.div`
    background-color: ${COLORS.LIGHT_DARK};
    display: flex;
    min-height: 100vh;
    width: 1000px;
    margin: 0 auto;
    @media (max-width: 768px) {
      width: 100%;
    }
  `,
  Content = styled.div`
    padding: 20px 0;
    margin: 0 auto;
    margin-top: 55px;
    width: 100%;
    @media (max-width: 768px) {
      margin: 50px 10px 10px 10px;
    }
  `,
  DescContainer = styled.div`
    background: ${COLORS.DARK};
    border-radius: 5px;
    padding: 0px 10px 3px 10px;
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-top: 10px;
  `,
  Row = styled.div`
    color: ${COLORS.LIGHT};
    display: flex;
    font-weight: bold;
    padding: 3px 0;
  `,
  RowDesc = styled(Row)`
    flex-direction: column;
  `,
  Label = styled.div`
    padding-right: 10px;
    font-weight: 400;
    text-transform: capitalize;
  `,
  Text = styled(DOTS)``,
  Desc = styled.div`
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
    margin-left: 15px;
  `,
  DescSocial = styled(Desc)`
    word-wrap: break-word;
    word-break: break-all;
    -webkit-touch-callout: text;
    -webkit-user-select: text;
    -khtml-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  `,
  Address = styled.div`
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
    @media (max-width: 768px) {
      text-decoration: underline;
    }
  `,
  SchTable = styled(DescContainer)`
    margin-top: 0;
    display: flex;
    flex: 1;
    color: ${COLORS.LIGHT};
    padding: 10px;
    @media (max-width: 768px) {
      margin-top: 10px;
      margin-left: 0;
    }
  `,
  SchCol = styled.div`
    display: flex;
    flex: 1;
    padding: 5px 0;
    justify-content: center;
    border-bottom: 1px solid ${COLORS.LIGHT_DARK};
    &:last-child {
      border-bottom: none;
    }
  `,
  SchRow = styled.div`
    color: ${({ closed }) => closed && COLORS.ERROR_COLOR};
    display: flex;
    flex: 1;
    justify-content: center;
  `,
  GaleryWrap = styled.div`
    .carousel-root {
      height: 267px;
      width: 475px;
      margin: 0 auto;
      border-radius: 5px;
      @media (max-width: 768px) {
        width: 100%;
        height: auto;
      }
    }
    .carousel-slider {
      border-radius: 5px;
      background: ${COLORS.DARK};
    }
    .carousel-status {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 0 0 0 5px;
    }
    .carousel .thumbs-wrapper {
      display: none;
    }
    .carousel .control-dots .dot {
      box-shadow: 0 0 5px 1px ${COLORS.DARK};
      margin: 0 4px;
    }
    .thumbs {
      cursor: pointer;
    }
    .thumb {
      border-radius: 5px;
      border: 3px solid ${COLORS.DARK};
    }
    .carousel .thumb.selected,
    .carousel .thumb:hover {
      border: 3px solid ${COLORS.LIGHT} !important;
    }
    .carousel .control-next.control-arrow:before {
      border-left: 8px solid ${COLORS.LIGHT};
    }
    .carousel .control-prev.control-arrow:before {
      border-right: 8px solid ${COLORS.LIGHT};
    }
    .carousel .thumb img {
      border-radius: 3px;
      overflow: hidden;
    }
    .carousel .slide .legend {
      background: ${COLORS.DARK};
      padding: 5px;
      bottom: 22px;
    }
    .carousel .control-dots {
      margin: 3px 0 7px 0;
      width: 80%;
      padding-left: 100px;
      @media (max-width: 768px) {
        margin-bottom: 7px;
        padding-left: 0;
      }
    }
  `,
  Social = styled.div``,
  Cat = styled.span`
    margin-right: 5px;
  `,
  Btns = styled.div`
    display: flex;
    width: 100%;
    height: 50px;
    margin-top: 45px;
    @media (max-width: 768px) {
      height: 40px;
    }
  `,
  BtnWrap = styled.div`
    width: 100%;
    &:first-child {
      margin-right: 5px;
    }
    &:last-child {
      margin-left: 5px;
    }
  `,
  VideoWrap = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  `,
  TopBlock = styled.div`
    display: flex;
    @media (max-width: 768px) {
      flex-direction: column;
    }
  `,
  CarouselWrap = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    background: ${COLORS.DARK};
    padding: 10px;
    margin-right: 10px;
    border-radius: 5px;
    @media (max-width: 768px) {
      margin-right: 0px;
    }
  `,
  WorkTime = styled.div`
    text-align: center;
    text-transform: uppercase;
  `,
  NoVideo = styled.div`
    display: flex;
    flex: 1;
    height: 100%;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    color: ${COLORS.LIGHT};
    width: 100%;
  `,
  ImgPreview = styled.img`
    display: none;
  `;

export const Company = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { place, loading } = useSelector((st) => st.companyPlace),
    { isLoading, lng } = useSelector((st) => st.common);

  const { alias } = useParams();

  const [isAdult, setIsAdult] = useState(null),
    [isStop, setIsStop] = useState(false),
    [onlineStream, setOnlineStreams] = useState([]);

  useEffect(() => {
    if (place) {
      place.adult && setIsAdult(true);
      const strNew = [];
      place.streams.forEach((str) => {
        if (str.online.is_online) {
          strNew.push(str);
          setOnlineStreams(strNew);
        }
      });
    }
  }, [place]);

  useEffect(() => {
    document.title = `for test | ${alias}`;
    dispatch(companyPlaceActions.clearPlace());
    if (!isNaN(alias)) {
      dispatch(companyPlaceActions.fetchPlace(alias));
    } else {
      dispatch(companyPlaceActions.fetchPlaceByAlias(alias));
    }
  }, []);

  const toMap = (lat, lon) => {
      dispatch(mapPlacesActions.setIsWorking(false));
      dispatch(
        commonActions.setCurrentCityInfo({
          id: place.city.id,
          name: place.city.name,
          lat: place.city.lat,
          lon: place.city.lon,
        })
      );
      dispatch(commonActions.setCurrentCategoryInfo({ id: null, name: null }));
      dispatch(commonActions.setSearchString(""));
      navigate(`/map/${lat};${lon}/20/${place.city.id}/${place.city.name}`);
    },
    whatIsThis = (text) => {
      const email =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
        url =
          /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

      if (text.toLowerCase().match(email)) {
        return <a href={`mailto:${text}`}>{text}</a>;
      } else if (text.toLowerCase().match(url)) {
        return (
          <a target="_blank" rel="noreferrer" href={text}>
            {text}
          </a>
        );
      }

      return text;
    },
    getUrl = (url) => `${QUERY_PATH}/imgcache/${320}/${180}/storage/${url}`,
    stopVolume = () => {
      setIsStop(false);
      setTimeout(() => {
        setIsStop(true);
      });
    };

  return (
    <Container>
      <Header
        name={place && place.name}
        isWork={place && place.is_work && place.currentScheduleInterval}
      />
      {console.log(place, "===place")}
      {place && (
        <Content>
          <GaleryWrap>
            <TopBlock>
              <CarouselWrap>
                <Carousel
                  infiniteLoop={true}
                  transitionTime={200}
                  useKeyboardArrows={true}
                  onChange={stopVolume}
                >
                  {onlineStream.map((str) => (
                    <div key={str.id}>
                      <ImgPreview src={str.user_preview} alt="imgpreview" />
                      <VideoWrap>
                        <VideoPlayer
                          src={str.user_url}
                          preview={str.user_preview}
                          blur={str.blur / 100}
                          volume={str.default_sound_volume}
                          isStop={isStop}
                        />
                      </VideoWrap>
                    </div>
                  ))}

                  {place.images[0] ? (
                    place.images.map((img) => (
                      <div key={img.url}>
                        <img src={getUrl(img.url)} alt="imgdesc" />
                        {img.description && (
                          <p className="legend">{img.description}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <img
                      src={`${process.env.PUBLIC_URL}/img/nophoto.jpg`}
                      alt="imgdesc"
                    />
                  )}
                </Carousel>
              </CarouselWrap>

              <SchTable>
                <WorkTime>{txt[lng].company.worktime}</WorkTime>
                {place.schedules.map((sch) => (
                  <SchCol key={sch.day}>
                    <SchRow>{txt[lng].company[sch.day]}</SchRow>
                    <SchRow closed={sch.weekend}>
                      {sch.weekend ? "Closed" : sch.start_time}
                    </SchRow>
                    <SchRow closed={sch.weekend}>
                      {sch.weekend ? "Closed" : sch.end_time}
                    </SchRow>
                  </SchCol>
                ))}
              </SchTable>
            </TopBlock>
          </GaleryWrap>

          <DescContainer>
            <Row>
              <Label>{txt[lng].company.type}:</Label>
              <Text>
                {place.categories.map((cat) => (
                  <Cat key={cat.name}>{cat.name}</Cat>
                ))}
              </Text>
            </Row>

            <Row>
              <Label>{txt[lng].company.address}:</Label>
              <Address onClick={() => toMap(place.lat, place.lon)}>
                {place.address}
              </Address>
            </Row>

            {place.socials[0] && (
              <RowDesc>
                <Label>{txt[lng].company.contacts}:</Label>
                <Social>
                  {place.socials.map((el) => (
                    <DescSocial key={el.name}>
                      {el.name} : {whatIsThis(el.url)}
                    </DescSocial>
                  ))}
                </Social>
              </RowDesc>
            )}

            {place.description && (
              <RowDesc>
                <Label>{txt[lng].company.description}:</Label>
                <Desc>{place.description}</Desc>
              </RowDesc>
            )}
          </DescContainer>
        </Content>
      )}

      {!localStorage.getItem("adult") && (
        <Popup
          visible={isAdult}
          header={txt[lng].company.adult}
          footer={
            <Btns>
              <BtnWrap>
                <Btn
                  active
                  text={txt[lng].company.yes}
                  click={() => {
                    setIsAdult(false);
                    localStorage.setItem("adult", true);
                  }}
                />
              </BtnWrap>

              <BtnWrap>
                <Btn
                  active
                  text={txt[lng].company.no}
                  click={() => {
                    setIsAdult(false);
                    navigate(-1);
                  }}
                />
              </BtnWrap>
            </Btns>
          }
        />
      )}

      {(loading || isLoading) && <Loader />}
    </Container>
  );
};
