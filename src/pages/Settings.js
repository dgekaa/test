import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { COLORS, txt } from "../other/constants";
import { Back, Btn, Header, Loader, Popup, SearchInput } from "../components";
import { settingsActions } from "../store/settings";

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
    padding: 20px 0;
    margin: 0 auto;
    margin-top: 45px;
    width: 100%;
    @media (max-width: 768px) {
      margin: 40px 15px 0 15px;
    }
  `,
  BottomBlock = styled.div`
    display: flex;
    flex-direction: column;
  `,
  List = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    color: ${COLORS.LIGHT};
    border: 3px solid ${COLORS.LIGHT};
    margin: 0 0 10px 0;
    border-radius: 5px;
    background: ${COLORS.DARK};
  `,
  ListName = styled.div`
    color: ${COLORS.LIGHT};
    margin-bottom: 10px;
    font-weight: bold;
    align-self: center;
    text-transform: uppercase;
  `,
  Add = styled(ListName)`
    color: ${COLORS.SUCCESS_COLOR};
    cursor: pointer;
    transition: 0.1s ease transform;
    text-transform: uppercase;
  `,
  CreatePlaceForm = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: space-around;
    margin-bottom: 10px;
    height: ${({ count }) => `${count * 60}px`};
  `,
  NameRow = styled.div`
    display: flex;
    justify-content: space-between;
    height: 35px;
    align-items: center;
    margin-bottom: 5px;
    padding: 10px;
    font-weight: ${({ top }) => (top ? "bold" : "400")};
  `,
  Row = styled(NameRow)`
    cursor: pointer;
    transition: 0.3s ease background-color;
    &:hover {
      background-color: ${COLORS.DARK};
    }
  `,
  Del = styled.div`
    cursor: pointer;
    color: ${COLORS.ERROR_COLOR};
    width: 35px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.1s ease transform;
    background: ${COLORS.LIGHT};
    border-radius: 5px;
  `,
  El = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${({ del }) => (del ? "35px" : "auto")};
    text-transform: ${({ head }) => head && "uppercase"};
    flex: ${({ del }) => (del ? "none" : 1)};
    flex: ${({ flex }) => flex};
    @media (max-width: 768px) {
      display: ${({ desc }) => desc && "none"};
    }
  `,
  DeleteBtnWrap = styled.div`
    width: 100%;
    margin-top: 15px;
    height: 50px;
    @media (max-width: 768px) {
      height: 40px;
    }
  `,
  Input = styled.div`
    height: 50px;
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
  PopupContent = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    margin: 10px 0;
  `;

export const Settings = () => {
  const dispatch = useDispatch();
  const { isLoading, cities, categories, lng } = useSelector((st) => st.common),
    {
      loading,
      isAddCityPP,
      isAddCategoryPP,
      isEditCityPP,
      isEditCatPP,
      newCityName,
      newCatName,
      newCityLatLon,
      isDelCityPP,
      isDelCategoryPP,
      deleteCityInfo,
      deleteCategoryInfo,
      editCityInfo,
      editCatInfo,
      places,
    } = useSelector((st) => st.settings);

  useEffect(() => {
    document.title = "for test | Settings";
  }, []);

  const tglAddCityPP = (bool) => {
      dispatch(settingsActions.tglAddCityPP(bool));
    },
    tglAddCategoryPP = (bool) => {
      dispatch(settingsActions.tglAddCategoryPP(bool));
    },
    tglEditCityPP = (bool, el) => {
      dispatch(settingsActions.tglEditCityPP(bool));
      dispatch(
        settingsActions.editCityPPInfo(
          el
            ? {
                id: el.id,
                name: el.name,
                slug: el.slug,
                lat: el.lat,
                lon: el.lon,
                address: el.address,
              }
            : { name: "", id: "", slug: "", lat: "", lon: "", address: "" }
        )
      );
    },
    tglEditCatPP = (bool, id, name, slug) => {
      dispatch(settingsActions.tglEditCatPP(bool));
      dispatch(settingsActions.editCatPPInfo({ id, name, slug }));
    },
    tglDelCityPP = (bool, name, id) => {
      dispatch(settingsActions.tglDelCityPP(bool));
      dispatch(settingsActions.setDelCityPPInfo({ name, id }));
    },
    tglDelCategoryPP = (bool, name, id) => {
      dispatch(settingsActions.tglDelCategoryPP(bool));
      dispatch(settingsActions.setDelCategoryPPInfo({ name, id }));
    },
    setNewCityName = (text) => {
      dispatch(settingsActions.setNewCityName(text));
    },
    setNewCatName = (text) => {
      dispatch(settingsActions.setNewCatName(text));
    },
    setNewEditCityName = (text) => {
      dispatch(
        settingsActions.editCityPPInfo({
          ...editCityInfo,
          name: text,
        })
      );
    },
    setNewEditCitySlug = (text) => {
      dispatch(
        settingsActions.editCityPPInfo({
          ...editCityInfo,
          slug: text,
        })
      );
    },
    setNewEditCityLat = (text) => {
      dispatch(
        settingsActions.editCityPPInfo({
          ...editCityInfo,
          lat: text,
        })
      );
    },
    setNewEditCityLon = (text) => {
      dispatch(
        settingsActions.editCityPPInfo({
          ...editCityInfo,
          lon: text,
        })
      );
    },
    setNewEditCityAddr = (text) => {
      dispatch(
        settingsActions.editCityPPInfo({
          ...editCityInfo,
          address: text,
        })
      );
    },
    setNewEditCatName = (text) => {
      dispatch(
        settingsActions.editCatPPInfo({
          ...editCatInfo,
          name: text,
        })
      );
    },
    setNewEditCatSlug = (text) => {
      dispatch(
        settingsActions.editCatPPInfo({
          ...editCatInfo,
          slug: text,
        })
      );
    },
    setNewCityLatLon = (num) => {
      dispatch(settingsActions.setNewCityLatLon(num));
    },
    createCity = () => {
      dispatch(settingsActions.fetchAddCity(newCityName, newCityLatLon));
    },
    createCategory = () => {
      dispatch(settingsActions.fetchAddCategory(newCatName));
    },
    editCity = () => {
      dispatch(
        settingsActions.fetchEditCity(
          editCityInfo.id,
          editCityInfo.name,
          editCityInfo.slug,
          editCityInfo.lat,
          editCityInfo.lon,
          editCityInfo.address
        )
      );
    },
    editCat = () => {
      dispatch(
        settingsActions.fetchEditCat(
          editCatInfo.id,
          editCatInfo.name,
          editCatInfo.slug
        )
      );
    };

  return (
    <Container>
      <Header />
      <Content>
        <Back param="/list" />
        <BottomBlock>
          <List>
            <NameRow>
              <ListName>{txt[lng].settings.cities}</ListName>
              <Add onClick={(e) => tglAddCityPP(true)}>
                {txt[lng].settings.addnew}
              </Add>
            </NameRow>

            <NameRow top={true}>
              <El head flex={1}>
                ID
              </El>
              <El head flex={4}>
                {txt[lng].settings.name}
              </El>
              <El head flex={4}>
                {txt[lng].settings.slug}
              </El>
              <El head desc flex={4}>
                {txt[lng].settings.coords}
              </El>
              <El head desc flex={4}>
                {txt[lng].settings.address}
              </El>
              <El head del={true}>
                {txt[lng].settings.del}
              </El>
            </NameRow>

            {cities.map((el) => (
              <Row key={el.slug} onClick={() => tglEditCityPP(true, el)}>
                <El flex={1}>{el.id}</El>
                <El flex={4}>{el.name}</El>
                <El flex={4}>{el.slug}</El>
                <El desc flex={4}>
                  {el.lat + ";" + el.lon}
                </El>
                <El desc flex={4}>
                  {el.address}
                </El>
                <Del
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(settingsActions.fetchPlaces(el.id));
                    tglDelCityPP(true, el.name, el.id);
                  }}
                >
                  &#10006;
                </Del>
              </Row>
            ))}
          </List>

          <List>
            <NameRow>
              <ListName>{txt[lng].settings.cat}</ListName>
              <Add onClick={() => tglAddCategoryPP(true)}>
                {txt[lng].settings.addnew}
              </Add>
            </NameRow>

            <NameRow top={true}>
              <El head flex={1}>
                ID
              </El>
              <El head flex={4}>
                {txt[lng].settings.name}
              </El>
              <El head flex={4}>
                {txt[lng].settings.slug}
              </El>
              <El head del={true}>
                {txt[lng].settings.del}
              </El>
            </NameRow>

            {categories.map((el) => (
              <Row
                key={el.slug}
                onClick={() => tglEditCatPP(true, el.id, el.name, el.slug)}
              >
                <El flex={1}>{el.id}</El>
                <El flex={4}>{el.name}</El>
                <El flex={4}>{el.slug}</El>
                <Del
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(settingsActions.fetchPlaces(el.id, true));
                    tglDelCategoryPP(true, el.name, el.id);
                  }}
                >
                  &#10006;
                </Del>
              </Row>
            ))}
          </List>
        </BottomBlock>
      </Content>

      <Popup
        visible={isEditCityPP}
        header={txt[lng].settings.editcity}
        close={() => tglEditCityPP(false)}
        content={
          <CreatePlaceForm count={5}>
            <Input>
              <SearchInput
                name={"name"}
                placeholder={`${txt[lng].settings.name}*`}
                value={editCityInfo.name}
                changeText={setNewEditCityName}
              />
            </Input>
            <Input>
              <SearchInput
                name={"slug"}
                placeholder={`${txt[lng].settings.slug}*`}
                value={editCityInfo.slug}
                changeText={setNewEditCitySlug}
              />
            </Input>
            <Input>
              <SearchInput
                name={"lat"}
                placeholder={`${txt[lng].settings.lat}*`}
                value={editCityInfo.lat}
                changeText={setNewEditCityLat}
              />
            </Input>
            <Input>
              <SearchInput
                name={"lon"}
                placeholder={`${txt[lng].settings.lon}*`}
                value={editCityInfo.lon}
                changeText={setNewEditCityLon}
              />
            </Input>
            <Input>
              <SearchInput
                name={"addr"}
                placeholder={`${txt[lng].settings.address}*`}
                value={editCityInfo.address}
                changeText={setNewEditCityAddr}
              />
            </Input>
          </CreatePlaceForm>
        }
        footer={
          <CreateBtn>
            <Btn active text={txt[lng].settings.save} click={editCity} />
          </CreateBtn>
        }
      />

      <Popup
        visible={isEditCatPP}
        header={txt[lng].settings.editcat}
        close={() => tglEditCatPP(false)}
        content={
          <CreatePlaceForm count={2}>
            <Input>
              <SearchInput
                name={"name"}
                placeholder={`${txt[lng].settings.name}*`}
                value={editCatInfo.name}
                changeText={setNewEditCatName}
              />
            </Input>

            <Input>
              <SearchInput
                name={"slug"}
                placeholder={`${txt[lng].settings.slug}*`}
                value={editCatInfo.slug}
                changeText={setNewEditCatSlug}
              />
            </Input>
          </CreatePlaceForm>
        }
        footer={
          <CreateBtn>
            <Btn active text={txt[lng].settings.save} click={editCat} />
          </CreateBtn>
        }
      />

      <Popup
        visible={isAddCityPP}
        header={txt[lng].settings.createcity}
        close={() => tglAddCityPP(false)}
        content={
          <CreatePlaceForm count={2}>
            <Input>
              <SearchInput
                name={"name"}
                placeholder={`${txt[lng].settings.name}*`}
                value={newCityName}
                changeText={setNewCityName}
              />
            </Input>

            <Input>
              <SearchInput
                name={"latlon"}
                placeholder={`${txt[lng].settings.geo}*`}
                value={newCityLatLon}
                changeText={setNewCityLatLon}
              />
            </Input>
          </CreatePlaceForm>
        }
        footer={
          <CreateBtn>
            <Btn active text={txt[lng].settings.create} click={createCity} />
          </CreateBtn>
        }
      />

      <Popup
        visible={isAddCategoryPP}
        header={txt[lng].settings.createcat}
        close={() => tglAddCategoryPP(false)}
        content={
          <CreatePlaceForm count={1}>
            <Input>
              <SearchInput
                name={"name"}
                placeholder={`${txt[lng].settings.name}*`}
                value={newCatName}
                changeText={setNewCatName}
              />
            </Input>
          </CreatePlaceForm>
        }
        footer={
          <CreateBtn>
            <Btn
              active
              text={txt[lng].settings.create}
              click={createCategory}
            />
          </CreateBtn>
        }
      />

      <Popup
        visible={isDelCityPP}
        header={`${txt[lng].settings.delcity} "${deleteCityInfo.name}"`}
        close={() => {
          dispatch(settingsActions.setPlaces([]));
          tglDelCityPP(false);
        }}
        content={
          <PopupContent>
            {places[0] && `Есть ${places.length} заведений с таким городом`}
          </PopupContent>
        }
        footer={
          <DeleteBtnWrap>
            <Btn
              active
              text={txt[lng].settings.delete}
              click={() =>
                dispatch(settingsActions.fetchDelCity(deleteCityInfo.id))
              }
            />
          </DeleteBtnWrap>
        }
      />

      <Popup
        visible={isDelCategoryPP}
        header={`${txt[lng].settings.delcat} "${deleteCategoryInfo.name}"`}
        close={() => {
          dispatch(settingsActions.setPlaces([]));
          tglDelCategoryPP(false);
        }}
        content={
          <PopupContent>
            {places[0] && `Есть ${places.length} заведений с такой категорией`}
          </PopupContent>
        }
        footer={
          <DeleteBtnWrap>
            <Btn
              active
              text={txt[lng].settings.delete}
              click={() =>
                dispatch(
                  settingsActions.fetchDelCategory(deleteCategoryInfo.id)
                )
              }
            />
          </DeleteBtnWrap>
        }
      />

      {(loading || isLoading) && <Loader />}
    </Container>
  );
};
