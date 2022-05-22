import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { COLORS, txt } from "../other/constants";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { DOTS } from "../other/styles";

export const Menu = styled.div`
    display: flex;
    color: ${COLORS.LIGHT};
  `,
  NoMenu = styled.div`
    height: 35px;
  `,
  MenuBtn = styled(DOTS)`
    display: flex;
    flex: 1;
    cursor: pointer;
    height: 35px;
    border-radius: 5px;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    margin-right: 10px;
    font-weight: bold;
    background: ${({ active }) => (active ? COLORS.LIGHT : COLORS.DARK)};
    color: ${({ active }) => (active ? COLORS.DARK : COLORS.LIGHT)};
    border: ${({ active }) =>
      active ? `3px solid ${COLORS.DARK}` : `3px solid transparent}`};

    &:last-child {
      margin-right: 0;
    }
    @media (max-width: 768px) {
      font-size: 10px;
      text-align: center;
      margin-right: 5px;
    }
  `;

export const AdminNav = ({ active }) => {
  const navigate = useNavigate();
  const { alias } = useParams();

  const { lng } = useSelector((state) => state.common);

  const [pages, setPages] = useState("");

  useEffect(() => {
    setPages([
      { slug: "profile", name: txt[lng].adminnav.profile },
      { slug: "stream", name: txt[lng].adminnav.stream },
      { slug: "worksch", name: txt[lng].adminnav.worksch },
    ]);
  }, [lng]);

  return (
    <Menu>
      {!!pages ? (
        pages.map((page) => (
          <MenuBtn
            key={page.slug}
            active={active === page.slug}
            onClick={() =>
              navigate(`/admin/${alias}/${page.slug}`, { replace: true })
            }
          >
            {page.name}
          </MenuBtn>
        ))
      ) : (
        <NoMenu />
      )}
    </Menu>
  );
};
