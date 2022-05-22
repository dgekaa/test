import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { COLORS, txt } from "../other/constants";
import {
  AdminNav,
  Back,
  Btn,
  Header,
  Loader,
  MyRange,
  SearchInput,
  StreamSch,
  VideoPlayer,
} from "../components";
import { useParams } from "react-router-dom";
import { streamActions } from "../store/stream";
import { commonActions } from "../store/common";
import { isOnlineOn } from "../other/functions";
import { NavBtns, ToPlace } from "./Profile";
import Switch from "react-switch";
import { RiSaveLine } from "react-icons/ri";

const Container = styled.div`
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
    position: relative;
    width: 1000px;
    padding-top: 65px;
    @media (max-width: 768px) {
      width: 100vw;
      padding: 0 10px;
      padding-top: 60px;
    }
  `,
  OneStream = styled.div`
    display: flex;
    color: ${COLORS.LIGHT};
    flex-direction: column;
    padding: 10px;
    border-radius: 0 5px 5px 5px;
    background: ${COLORS.DARK};
    margin: ${({ last }) => (last ? "37px 0 20px 0" : "37px 0 50px 0")};
  `,
  StreamName = styled.div`
    position: absolute;
    text-transform: uppercase;
    background: ${COLORS.DARK};
    border-bottom: none;
    border-radius: 5px 5px 0 0;
    color: ${COLORS.LIGHT};
    top: -32px;
    left: -10px;
    padding: 3px 10px;
  `,
  TopContainer = styled.div`
    display: flex;
    position: relative;
    @media (max-width: 768px) {
      flex-direction: column;
    }
  `,
  VideoBlock = styled.div`
    display: flex;
    height: 270px;
    width: 480px;
    background: ${COLORS.DARK};
    border-radius: 5px;
    color: ${COLORS.LIGHT};
    overflow: hidden;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    margin-right: 10px;
    border: 3px solid ${COLORS.LIGHT};
    @media (max-width: 768px) {
      margin-bottom: 15px;
      width: 100%;
      height: auto;
    }
  `,
  NoVideoBlock = styled.div`
    display: flex;
    height: 270px;
    width: 480px;
    background: ${COLORS.DARK};
    border-radius: 5px;
    color: ${COLORS.LIGHT};
    overflow: hidden;
    justify-content: center;
    align-items: center;
    margin-right: 15px;
    text-align: center;
    border: 3px solid ${COLORS.LIGHT};
    @media (max-width: 768px) {
      margin-bottom: 15px;
      width: 100%;
      height: calc(100vw / 1.777);
    }
  `,
  RightBlock = styled.div`
    display: flex;
    height: 270px;
    flex: 1;
    overflow: hidden;
  `,
  LinkLabel = styled.div`
    margin-bottom: 5px;
    font-weight: bold;
    text-transform: uppercase;
  `,
  Link = styled.div`
    -webkit-touch-callout: text;
    -webkit-user-select: text;
    -khtml-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  `,
  CopyToBufer = styled.div`
    cursor: pointer;
    margin-bottom: 20px;
    &:hover {
      text-decoration: underline;
    }
  `,
  DeleteBtn = styled.div`
    display: flex;
    flex: 1;
    height: 50px;
    margin-bottom: 20px;
    @media (max-width: 768px) {
      width: 100%;
      height: 40px;
    }
  `,
  CreateBtn = styled.div`
    position: absolute;
    top: 153px;
    right: 0px;
    background: ${COLORS.DARK};
    color: ${COLORS.LIGHT};
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 10px;
    font-weight: bold;
    @media (max-width: 768px) {
      top: 148px;
      right: 10px;
    }
  `,
  RangeBlur = styled.div`
    display: flex;
    flex: 1;
    margin: 25px 0;
    align-items: center;
  `,
  RangeBlurText = styled.span`
    margin-right: 25px;
    text-transform: uppercase;
  `,
  VideoVolumeBlur = styled.div`
    display: flex;
    flex-direction: column;
  `,
  InputWrap = styled.div`
    display: flex;
    height: 50px;
    margin-top: 10px;
    flex: 1;
    @media (max-width: 768px) {
      flex: none;
      height: 40px;
    }
  `,
  SaveName = styled.div`
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
    margin-left: 10px;
  `,
  IfWant = styled.div`
    width: 100%;
    padding: 10px;
    background: ${COLORS.DARK};
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    margin-bottom: 10px;
    color: ${COLORS.LIGHT};
    text-transform: uppercase;
  `;

const InputName = ({ name, changeStreamName, i, saveName, id }) => {
  const { lng } = useSelector((st) => st.common);

  return (
    <InputWrap>
      <SearchInput
        placeholder={txt[lng].stream.streamname}
        name={"streamname"}
        value={name}
        changeText={(txt) => changeStreamName(i, txt)}
      />
      <SaveName onClick={() => saveName(id, name)}>
        <RiSaveLine />
      </SaveName>
    </InputWrap>
  );
};

export const Stream = () => {
  const dispatch = useDispatch();
  const { alias } = useParams();

  const [blur, setBlur] = useState([]);

  const { isLoading, lng } = useSelector((st) => st.common),
    { loading, place, volume, newStreamName } = useSelector((st) => st.stream),
    authState = useSelector((st) => st.auth);

  const isSuper = authState.user.type === "employee";

  useEffect(() => {
    document.title = "for test | Stream";
    dispatch(streamActions.fetchPlace(alias));
  }, []);

  useEffect(() => {
    if (place) {
      place.streams.forEach((str) => setBlur((prev) => [...prev, str.blur]));
    }
  }, [place]);

  const fetchBlur = (num, streamId) => {
      dispatch(streamActions.fetchUpdateBlur(streamId, num, alias));
    },
    fetchVolume = (vol, streamId) => {
      dispatch(streamActions.fetchUpdateVolume(streamId, vol, alias));
    },
    createStream = () => {
      dispatch(streamActions.fetchCreateStream(place.id, place.alias));
    },
    saveName = (id, name) => {
      name
        ? dispatch(streamActions.fetchUpdateStreamName(id, name, alias))
        : dispatch(commonActions.setErr({ ownErr: txt[lng].err.strname }));
    },
    changeStreamName = (i, txt) => {
      const newStrName = [...newStreamName];
      newStrName[i] = txt;
      dispatch(streamActions.setNewStreamName(newStrName));
    };

  return (
    <Container>
      <Header />
      <Content>
        {place && isSuper && (
          <CreateBtn onClick={createStream}>
            {txt[lng].stream.createstr}
          </CreateBtn>
        )}
        <NavBtns>
          <Back param="/list" />
          {place && !place.disabled && (
            <ToPlace to={`/place/${alias}`}>{txt[lng].profile.toplace}</ToPlace>
          )}
        </NavBtns>
        <AdminNav active="stream" />

        {place &&
          place.streams.map((str, i) => (
            <OneStream key={str.url} last={i === place.streams.length - 1}>
              <TopContainer>
                <StreamName>{str.name}</StreamName>
                {isOnlineOn(str) ? (
                  <VideoVolumeBlur>
                    <VideoBlock>
                      <VideoPlayer
                        src={str.url}
                        preview={str.preview}
                        blur={blur[i] / 100}
                        volume={volume[i]}
                        admin={true}
                      />
                    </VideoBlock>

                    <RangeBlur>
                      <RangeBlurText>
                        {volume[i]
                          ? txt[lng].stream.volon
                          : txt[lng].stream.voloff}
                        :
                      </RangeBlurText>
                      <Switch
                        checked={volume[i]}
                        onChange={(num) => fetchVolume(num, str.id)}
                        offColor={COLORS.ERROR_COLOR}
                        onColor={COLORS.SUCCESS_COLOR}
                      />
                    </RangeBlur>
                    <RangeBlur>
                      <RangeBlurText>{txt[lng].stream.blur}:</RangeBlurText>

                      <MyRange
                        blur={blur[i]}
                        setBlur={(e) => {
                          const newBlur = [...blur];
                          newBlur[i] = e;
                          setBlur(newBlur);
                        }}
                        fetchBlur={fetchBlur}
                        stream={str}
                      />
                    </RangeBlur>
                  </VideoVolumeBlur>
                ) : (
                  <NoVideoBlock>{txt[lng].stream.notwork}</NoVideoBlock>
                )}

                {isSuper ? (
                  <RightBlock>
                    <div>
                      <DeleteBtn>
                        <Btn
                          active
                          text={txt[lng].stream.deletestr}
                          click={() =>
                            dispatch(
                              streamActions.fetchDeleteStream(
                                str.id,
                                place.alias
                              )
                            )
                          }
                        />
                      </DeleteBtn>

                      <LinkLabel>{txt[lng].stream.link}</LinkLabel>
                      <Link>{str.rtmp_url}</Link>
                      {navigator.clipboard && (
                        <CopyToBufer
                          onClick={() => {
                            dispatch(
                              commonActions.setErr({
                                ownErr: txt[lng].err.bufer,
                              })
                            );
                            dispatch(commonActions.setOk(true));
                            navigator.clipboard.writeText(str.rtmp_url);
                          }}
                        >
                          {txt[lng].stream.copylink}
                        </CopyToBufer>
                      )}

                      <InputName
                        name={newStreamName[i]}
                        changeStreamName={changeStreamName}
                        i={i}
                        saveName={saveName}
                        id={str.id}
                      />
                    </div>
                  </RightBlock>
                ) : (
                  <InputName
                    name={newStreamName[i]}
                    changeStreamName={changeStreamName}
                    i={i}
                    saveName={saveName}
                    id={str.id}
                  />
                )}
              </TopContainer>

              <StreamSch str={str} index={i} />
            </OneStream>
          ))}

        {place && !isSuper && <IfWant>{txt[lng].stream.ifwant}</IfWant>}
      </Content>

      {(loading || isLoading) && <Loader />}
    </Container>
  );
};
