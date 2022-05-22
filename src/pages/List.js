import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { COLORS, txt } from "../other/constants";
import { Btn, Header, Loader, Popup, SearchInput, Back } from "../components";
import { listActions } from "../store/list";
import { mainPlacesActions } from "../store/mainPlaces";
import { authActions } from "../store/authenticate";
import { profileActions } from "../store/profile";
import { streamActions } from "../store/stream";
import { workSchActions } from "../store/workSch";
import { commonActions } from "../store/common";
import { GoPerson } from "react-icons/go";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlinePoweroff } from "react-icons/ai";
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";
import Switch from "react-switch";
import { debounce } from "lodash";

const Container = styled.div`
    background-color: ${COLORS.LIGHT_DARK};
    display: flex;
    min-height: 100vh;
    width: 1000px;
    margin: 0 auto;
    @media (max-width: 768px) {
      width: 100vw;
    }
  `,
  Content = styled.div`
    width: 1000px;
    margin-top: 65px;
    padding-bottom: 20px;
    @media (max-width: 768px) {
      width: 100vw;
      margin: 60px 10px 10px 10px;
    }
  `,
  Logout = styled.div`
    width: 100px;
    height: 30px;
    margin-bottom: 15px;

    @media (max-width: 768px) {
      display: none;
    }
  `,
  TopBar = styled.div`
    display: flex;
    margin-bottom: 20px;
    justify-content: space-between;
  `,
  CreatePlaceForm = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 140px;
    justify-content: space-around;
    margin-bottom: 10px;
    height: ${({ count }) => `${count * 55}px`};
    margin-top: ${({ isOld }) => isOld && "30px"};
  `,
  YesBtnwrap = styled.div`
    margin-top: 40px;
    width: 100%;
    height: 50px;
    @media (max-width: 768px) {
      height: 40px;
    }
  `,
  BtnsInLine = styled.div`
    display: flex;
    flex: 1;
  `,
  Person = styled(GoPerson)`
    font-size: 20px;
    color: ${({ color }) => color};
  `,
  Delete = styled(MdDeleteForever)`
    font-size: 22px;
    color: ${({ color }) => color};
  `,
  Power = styled(AiOutlinePoweroff)`
    font-size: 22px;
    color: ${({ color }) => color};
  `,
  Input = styled.div`
    height: 50px;
    @media (max-width: 768px) {
      height: 40px;
    }
  `,
  BtnContainer = styled.div`
    width: 49%;
    height: 50px;
    @media (max-width: 768px) {
      height: 40px;
    }
  `,
  CameraVideo = styled(BsCameraVideo)`
    color: ${COLORS.SUCCESS_COLOR};
    margin: 3px 0 0 3px;
  `,
  CameraVideoOff = styled(BsCameraVideoOff)`
    color: ${COLORS.ERROR_COLOR};
    margin: 3px 0 0 3px;
  `,
  AddBtnWrap = styled.div`
    display: flex;
    flex: 1;
    height: 50px;
    margin-right: ${({ first }) => first && "10px"};
    @media (max-width: 768px) {
      height: 40px;
    }
  `,
  CreateBtn = styled.div`
    display: flex;
    flex: 1;
    height: 50px;
    @media (max-width: 768px) {
      height: 40px;
    }
  `,
  Cat = styled.span`
    margin-right: 5px;
  `,
  Table = styled.table`
    width: 100%;
  `,
  Tr = styled.tr`
    display: flex;
    flex: 1;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 10px;
    color: ${COLORS.LIGHT};
    transition: 0.1s ease box-shadow;
    &:hover {
      box-shadow: ${({ link }) => link && `0 0 3px 0 ${COLORS.LIGHT}`};
    }
  `,
  Th = styled.th`
    display: flex;
    flex: 1;
    height: 40px;
    text-align: center;
    justify-content: center;
    align-items: center;
    padding: 0 3px;
    background: ${COLORS.DARK};
    @media (max-width: 768px) {
      display: ${({ desc }) => desc && "none"};
    }
  `,
  Td = styled.td`
    display: flex;
    flex: 1;
    flex-direction: column;
    position: relative;
    background: ${COLORS.DARK};
    margin: 0 3px;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    overflow: hidden;
    text-align: center;
    cursor: ${({ link }) => link && "pointer"};
    transition: 0.1s ease margin;
    &:first-child {
      margin: 0;
    }
    &:last-child {
      margin: 0;
    }
    ${Tr}:hover & {
      margin: 0;
      border-radius: 0;
    }
    @media (max-width: 768px) {
      display: ${({ desc }) => desc && "none"};
    }
  `,
  TrInner = styled.div`
    display: flex;
    width: 100%;
  `,
  TdInner = styled.div`
    height: 40px;
    margin: 0 3px;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 0.3s ease all;
    &:first-child {
      margin: 0;
    }
    &:last-child {
      margin: 0;
    }
    &:hover {
    }
  `,
  OldUser = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  OldText = styled.span`
    padding-right: 10px;
  `,
  UserPlaces = styled.div`
    padding: 10px;
    display: flex;
    position: fixed;
    top: 10px;
    left: 10px;
    right: 10px;
    background: ${COLORS.DARK};
    border-radius: 10px;
    align-items: center;
    border: 3px solid ${COLORS.LIGHT};
  `,
  Places = styled.div`
    display: flex;
    flex-direction: column;
  `,
  Place = styled.span``,
  CamerasLength = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    font-size: 10px;
    padding: 0 2px;
    color: ${COLORS.SUCCESS_COLOR};
    font-weight: bold;
  `,
  IdBlock = styled.div`
    display: flex;
  `;

export const List = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
      loading,
      places,
      onOffPlaceInfo,
      addUserInfo,
      delPlaceInfo,
      newPlaceName,
      newPlaceAlias,
      addUserPass,
      addUserEmail,
      isAddPlacePP,
      isOnOffPP,
      isDeletePP,
      isAddUserPP,
      isOldUser,
    } = useSelector((st) => st.list),
    authState = useSelector((st) => st.auth),
    { currentCityInfo, isLoading, searchString, lng } = useSelector(
      (state) => state.common
    );

  const isSuper = authState.user.type === "employee";

  useEffect(() => {
    if (currentCityInfo.id) {
      isSuper
        ? dispatch(listActions.fetchAdminPlaces())
        : dispatch(listActions.fetchClientPlaces());
    }
  }, [currentCityInfo]);

  useEffect(() => {
    document.title = "for test | Admin";
  }, []);

  const logout = () => dispatch(authActions.fetchLogout()),
    delayed = useCallback(
      debounce(() => {
        dispatch(mainPlacesActions.clearPlaces());
        dispatch(listActions.fetchAdminPlaces());
      }, 500),
      []
    ),
    changeSearchText = (text) => {
      dispatch(commonActions.setSearchString(text));
      delayed();
    },
    toAdminPage = (alias) => {
      dispatch(profileActions.clearPlace());
      dispatch(streamActions.clearPlace());
      dispatch(workSchActions.clearPlace());
      navigate(`/admin/${alias}/profile`);
    },
    tglAddPlacePP = (bool) => dispatch(listActions.tglAddPlacePP(bool)),
    setNewPlaceName = (text) => dispatch(listActions.setNewPlaceName(text)),
    setNewPlaceAlias = (text) => dispatch(listActions.setNewPlaceAlias(text)),
    setAddUserEmail = (text) => dispatch(listActions.setAddUserEmail(text)),
    setAddUserPass = (text) => dispatch(listActions.setAddUserPass(text)),
    createPlace = () => {
      if (newPlaceName && newPlaceAlias) {
        dispatch(listActions.fetchAddPlace(newPlaceName, newPlaceAlias));
      }
    },
    addUser = () => {
      if (isOldUser) {
        if (addUserEmail) {
          dispatch(
            listActions.fetchAddOldUser(
              addUserEmail,
              addUserInfo.id,
              addUserInfo.name
            )
          );
        }
      } else {
        if (addUserEmail && addUserPass) {
          dispatch(
            listActions.fetchAddUser(addUserEmail, addUserPass, addUserInfo.id)
          );
        }
      }
    },
    tglOnOffPP = (bool, name, id, disabled) => {
      dispatch(listActions.tglOnOffPP(bool));
      dispatch(listActions.setOnOffPPInfo({ name, id, disabled }));
    },
    tglAddUserPP = (bool, name, id, disabled, user) => {
      setAddUserPass("");
      setAddUserEmail("");
      if (disabled || addUserInfo.disabled) {
        dispatch(listActions.tglAddUserPP(bool));
        dispatch(listActions.setAddUserPPInfo({ name, id, disabled, user }));
      } else {
        dispatch(listActions.tglAddUserPP(bool));
        dispatch(listActions.setAddUserPPInfo({ name, id, disabled, user }));
      }
    },
    tglDelPlacePP = (bool, id, name) => {
      dispatch(listActions.tglDelPlacePP(bool));
      dispatch(listActions.setDelPPPlaceInfo({ id, name }));
    },
    cityClick = (id, name, lat, lon) => {
      dispatch(commonActions.setCurrentCityInfo({ id, name, lat, lon }));
      dispatch(listActions.fetchAdminPlaces());
    };

  return (
    <Container>
      <Header
        filter
        cityBtnClick={cityClick}
        input={
          isSuper && (
            <SearchInput
              name={""}
              icon
              value={searchString}
              changeText={changeSearchText}
            />
          )
        }
      />

      <Content>
        <Back param="/" />

        {isSuper && (
          <TopBar>
            <BtnContainer>
              <Btn
                text={txt[lng].list.addplace}
                click={() => tglAddPlacePP(true)}
              />
            </BtnContainer>
            <BtnContainer>
              <Btn
                text={txt[lng].list.settings}
                click={() => navigate(`/list/settings`)}
              />
            </BtnContainer>
          </TopBar>
        )}

        <Logout>
          <Btn
            text={txt[lng].list.logout}
            click={logout}
            style={{ fontSize: "10px", color: COLORS.ERROR_COLOR }}
          />
        </Logout>

        <Table>
          <thead>
            <Tr>
              {isSuper && <Th style={{ flex: 0.3 }}>id</Th>}
              <Th>{txt[lng].list.name}</Th>
              <Th desc>alias</Th>
              <Th style={{ flex: 0.6 }}> {txt[lng].list.type}</Th>
              {isSuper && <Th style={{ flex: 0.6 }}></Th>}
            </Tr>
          </thead>

          {places &&
            places[0] &&
            places.map(
              ({ id, name, alias, streams, user, categories, disabled }) => (
                <tbody key={alias}>
                  <Tr link>
                    {isSuper && (
                      <Td
                        style={{ flex: 0.3 }}
                        link
                        onClick={() => toAdminPage(alias)}
                      >
                        <IdBlock>
                          {id}{" "}
                          {streams.length ? (
                            <>
                              <CameraVideo />
                              <CamerasLength>{streams.length}</CamerasLength>
                            </>
                          ) : (
                            <CameraVideoOff />
                          )}
                        </IdBlock>
                      </Td>
                    )}
                    <Td link onClick={() => toAdminPage(alias)}>
                      {name}
                    </Td>
                    <Td desc link onClick={() => toAdminPage(alias)}>
                      {alias}
                    </Td>
                    <Td
                      style={{ flex: 0.6 }}
                      link
                      onClick={() => toAdminPage(alias)}
                    >
                      {categories.map((cat) => (
                        <Cat key={cat.name}>{cat.name}</Cat>
                      ))}
                    </Td>

                    {isSuper && (
                      <Td style={{ flex: 0.6 }}>
                        <TrInner>
                          <TdInner
                            onClick={() => tglOnOffPP(true, name, id, disabled)}
                          >
                            <Power
                              color={
                                disabled
                                  ? COLORS.ERROR_COLOR
                                  : COLORS.SUCCESS_COLOR
                              }
                            />
                          </TdInner>
                          <TdInner
                            onClick={() =>
                              tglAddUserPP(true, name, id, !!user, user)
                            }
                          >
                            <Person
                              color={
                                user && user.type === "client"
                                  ? COLORS.SUCCESS_COLOR
                                  : COLORS.ERROR_COLOR
                              }
                            />
                          </TdInner>
                          <TdInner
                            onClick={() => tglDelPlacePP(true, id, name)}
                          >
                            <Delete color={COLORS.LIGHT} />
                          </TdInner>
                        </TrInner>
                      </Td>
                    )}
                  </Tr>
                </tbody>
              )
            )}
        </Table>

        <Popup
          visible={isAddPlacePP}
          header={txt[lng].list.createnew}
          close={() => tglAddPlacePP(false)}
          content={
            <CreatePlaceForm count={2}>
              <Input>
                <SearchInput
                  name={"name"}
                  light
                  placeholder={`${txt[lng].list.name}*`}
                  value={newPlaceName}
                  changeText={setNewPlaceName}
                />
              </Input>
              <Input>
                <SearchInput
                  name={"alias"}
                  light
                  placeholder="Alias*"
                  value={newPlaceAlias}
                  changeText={setNewPlaceAlias}
                />
              </Input>
            </CreatePlaceForm>
          }
          footer={
            <CreateBtn>
              <Btn active text={txt[lng].list.create} click={createPlace} />
            </CreateBtn>
          }
        />

        <Popup
          visible={isOnOffPP}
          header={`${txt[lng].list.hidequestion} ${
            onOffPlaceInfo.disabled ? txt[lng].list.show : txt[lng].list.hide
          } "${onOffPlaceInfo.name}"?`}
          close={() => tglOnOffPP(false)}
          footer={
            <YesBtnwrap>
              <Btn
                active
                text={txt[lng].list.yes}
                click={() => {
                  dispatch(
                    listActions.fetchDisablePlace(
                      onOffPlaceInfo.id,
                      onOffPlaceInfo.disabled
                    )
                  );
                }}
              />
            </YesBtnwrap>
          }
        />

        <Popup
          visible={isAddUserPP}
          header={`${
            addUserInfo.disabled
              ? txt[lng].list.edituser
              : txt[lng].list.adduser
          } "${addUserInfo.name}"?`}
          close={() => tglAddUserPP(false)}
          content={
            <CreatePlaceForm
              count={!addUserInfo.disabled ? (isOldUser ? 2 : 3) : 2}
            >
              {addUserInfo.user && addUserInfo.user.places && (
                <UserPlaces>
                  <Places>
                    {txt[lng].list.places}:
                    {addUserInfo.user.places.map((place) => (
                      <Place key={place.name}>
                        {place.id} - {place.name}
                      </Place>
                    ))}
                  </Places>
                </UserPlaces>
              )}

              {!addUserInfo.disabled && (
                <OldUser>
                  <OldText>
                    {isOldUser ? txt[lng].list.olduser : txt[lng].list.newuser}
                  </OldText>
                  <Switch
                    checked={isOldUser}
                    onChange={(num) => dispatch(listActions.setIsOldUser(num))}
                    offColor={COLORS.ERROR_COLOR}
                    onColor={COLORS.SUCCESS_COLOR}
                  />
                </OldUser>
              )}
              <Input>
                <SearchInput
                  name={"email"}
                  disabled={addUserInfo.disabled ? true : false}
                  placeholder="Email*"
                  value={
                    (addUserInfo.disabled && addUserInfo.user.email) ||
                    addUserEmail
                  }
                  changeText={setAddUserEmail}
                />
              </Input>
              {(!isOldUser || addUserInfo.disabled) && (
                <Input>
                  <SearchInput
                    name={"pass"}
                    placeholder={`${txt[lng].list.password}*`}
                    value={addUserPass}
                    changeText={setAddUserPass}
                  />
                </Input>
              )}
            </CreatePlaceForm>
          }
          footer={
            <BtnsInLine>
              {addUserInfo.disabled && (
                <AddBtnWrap first>
                  <Btn
                    active
                    text={txt[lng].list.save}
                    click={() =>
                      dispatch(
                        listActions.fetchChangePass(
                          addUserInfo.user.id,
                          addUserPass,
                          (addUserInfo.disabled && addUserInfo.user.email) ||
                            addUserEmail
                        )
                      )
                    }
                  />
                </AddBtnWrap>
              )}

              <AddBtnWrap>
                <Btn
                  active
                  text={
                    addUserInfo.disabled
                      ? txt[lng].list.delete
                      : txt[lng].list.add
                  }
                  click={() => {
                    addUserInfo.disabled
                      ? dispatch(
                          listActions.fetchDeleteUser(
                            addUserInfo.user.id,
                            addUserInfo.user &&
                              addUserInfo.user.places &&
                              addUserInfo.user.places.length > 1
                              ? addUserInfo.id
                              : null,
                            addUserInfo.user && addUserInfo.user.email,
                            addUserInfo.name
                          )
                        )
                      : addUser();
                  }}
                />
              </AddBtnWrap>
            </BtnsInLine>
          }
        />

        <Popup
          visible={isDeletePP}
          header={`${txt[lng].list.delquestion} "${delPlaceInfo.name}"?`}
          close={() => tglDelPlacePP(false)}
          footer={
            <YesBtnwrap>
              <Btn
                active
                text={txt[lng].list.yes}
                click={() =>
                  dispatch(listActions.fetchDeletePlace(delPlaceInfo.id))
                }
              />
            </YesBtnwrap>
          }
        />
      </Content>
      {(loading || authState.loading || isLoading) && <Loader />}
    </Container>
  );
};
