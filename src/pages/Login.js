import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { authActions } from "../store/authenticate";
import { COLORS, txt } from "../other/constants";
import { Header, Loader, SearchInput, Btn } from "../components";
import { commonActions } from "../store/common";

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
    display: flex;
    width: 1000px;
    height: 100vh;
    justify-content: center;
    align-items: center;
    @media (max-width: 768px) {
      width: 100%;
    }
  `,
  LoginContainer = styled.div`
    width: 400px;
    height: 200px;
    background-color: ${COLORS.DARK};
    border-radius: 5px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    @media (max-width: 768px) {
      width: 80%;
    }
  `,
  Input = styled.div`
    height: 50px;
    @media (max-width: 768px) {
      height: 40px;
    }
  `,
  BtnWrap = styled.div`
    height: 50px;
    @media (max-width: 768px) {
      height: 40px;
    }
  `;

export const Login = () => {
  const dispatch = useDispatch();
  const { loading, email, password } = useSelector((st) => st.auth),
    { isLoading, lng } = useSelector((st) => st.common);

  const click = () => {
      checkValidationError() &&
        dispatch(authActions.fetchLogin(email, password));
    },
    checkValidationError = () => {
      var regExp =
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        validEmail = regExp.test(String(email).toLowerCase());

      if (email.length < 1 || !validEmail) {
        dispatch(
          commonActions.setErr({
            ownErr: txt[lng].err.emailerr,
          })
        );
        dispatch(authActions.clearPassword());
        return false;
      } else if (password.length < 8) {
        dispatch(
          commonActions.setErr({
            ownErr: txt[lng].err.passerr,
          })
        );
        dispatch(authActions.clearPassword());
        return false;
      } else {
        dispatch(commonActions.setErr(""));
        return true;
      }
    },
    listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        click();
      }
    };

  useEffect(() => {
    document.title = `for test | Login`;
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [email, password]);

  return (
    <Container>
      <Header />
      <Content>
        <LoginContainer>
          <Input>
            <SearchInput
              name={"email"}
              type="email"
              placeholder="Email*"
              value={email}
              changeText={(text) => dispatch(authActions.setEmail(text))}
            />
          </Input>

          <Input>
            <SearchInput
              name={"password"}
              type="password"
              placeholder={`${txt[lng].login.password}*`}
              value={password}
              changeText={(text) => dispatch(authActions.setPassword(text))}
            />
          </Input>

          <BtnWrap>
            <Btn text={txt[lng].login.login} click={click} active />
          </BtnWrap>
        </LoginContainer>
      </Content>
      {(loading || isLoading) && <Loader />}
    </Container>
  );
};
