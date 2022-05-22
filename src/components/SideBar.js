import React from "react";
import styled from "styled-components";
import { COLORS, txt } from "../other/constants";
import { useSelector, useDispatch } from "react-redux";
import { sidebarActions } from "../store/sidebar";
import { authActions } from "../store/authenticate";
import { Link, useNavigate } from "react-router-dom";
import { GoPerson } from "react-icons/go";
import { FaMapMarked, FaHome } from "react-icons/fa";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { commonActions } from "../store/common";

const Opacity = styled.div`
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0);
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 1002;
    transform: ${({ show }) => (show ? "translateX(0)" : "translateX(100vw)")};
    transition: ${({ show }) => (show ? " 0.2s ease all" : " 0.6s ease all")};
  `,
  Container = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    width: 60vw;
    height: 100vh;
    display: flex;
    flex-direction: row;
    background-color: ${COLORS.DARK};
    border-left: 3px solid ${COLORS.LIGHT};
    z-index: 1002;
    transform: ${({ show }) => (show ? "translateX(0)" : "translateX(60vw)")};
    opacity: ${({ show }) => (show ? 1 : 0.4)};
    transition: 0.3s linear all;
  `,
  Ul = styled.div`
    display: flex;
    flex-direction: column;
    color: ${COLORS.LIGHT};
    width: 100%;
  `,
  Li = styled(Link)`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    transition: 0.2s ease background;
    border-bottom: 3px solid ${COLORS.LIGHT};
    &:hover {
      background: ${COLORS.LIGHT_DARK};
    }
  `,
  ToMap = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    transition: 0.2s ease background;
    border-bottom: 3px solid ${COLORS.LIGHT};
    &:hover {
      background: ${COLORS.LIGHT_DARK};
    }
  `,
  Logout = styled(ToMap)`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    transition: 0.2s ease background;
    border-bottom: 3px solid ${COLORS.LIGHT};
    color: ${COLORS.ERROR_COLOR};
    &:hover {
      background: ${COLORS.LIGHT_DARK};
    }
  `,
  Label = styled.span`
    text-transform: uppercase;
    margin-left: 10px;
    margin-right: 5px;
  `;

export const SideBar = ({ input, category, cities }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth),
    { sidebar } = useSelector((state) => state.sidebar),
    { currentCityInfo, lng } = useSelector((state) => state.common);

  const toMap = () => {
      const { id, lon, lat, name } = currentCityInfo;
      hide();
      navigate(`/map/${lat + ";" + lon}/12/${id}/${name}`);
    },
    hide = () => {
      dispatch(sidebarActions.hideSidebar());
    },
    logout = () => {
      dispatch(authActions.fetchLogout());
      hide();
    };

  return (
    <Opacity show={sidebar} onClick={hide}>
      <Container show={sidebar} onClick={(e) => e.stopPropagation()}>
        <Ul>
          {isAuthenticated ? (
            <Li onClick={hide} to="/list">
              <GoPerson />
              <Label>{txt[lng].header.profile}</Label>
            </Li>
          ) : (
            <Li onClick={hide} to="/login">
              <FiLogIn />
              <Label> {txt[lng].header.login}</Label>
            </Li>
          )}
          <Li onClick={hide} to="/">
            <FaHome />
            <Label>{txt[lng].header.home}</Label>
          </Li>
          <ToMap onClick={toMap}>
            <FaMapMarked />
            <Label>{txt[lng].header.map}</Label>
          </ToMap>
          <Li onClick={hide} to="/info">
            <BsFillInfoCircleFill />
            <Label>{txt[lng].header.info}</Label>
          </Li>
          {isAuthenticated && (
            <Logout onClick={logout}>
              <FiLogOut />
              <Label>{txt[lng].header.logout}</Label>
            </Logout>
          )}
        </Ul>
      </Container>
    </Opacity>
  );
};
