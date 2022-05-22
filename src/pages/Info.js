import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { COLORS, txt } from "../other/constants";
import {
  Header,
  Loader,
  SearchInput,
  Btn,
  TextArea,
  Accord,
} from "../components";
import { DOTS } from "../other/styles";
import { infoActions } from "../store/info";
import { commonActions } from "../store/common";
import {
  loadReCaptcha,
  reCaptchaExecute,
} from "recaptcha-v3-react-function-async";

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
    flex-direction: column;
    padding-top: 75px;
    @media (max-width: 768px) {
      width: 100%;
      padding: 70px 10px 10px 10px;
    }
  `,
  Page = styled.div`
    background: ${COLORS.DARK};
    border-radius: 5px;
    padding: 10px;
    color: ${COLORS.LIGHT};
    @media (max-width: 768px) {
    }
  `,
  ContactForm = styled.div`
    padding: 10px;
    background: ${COLORS.DARK};
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    margin-bottom: 10px;
    @media (max-width: 768px) {
    }
  `,
  InputWrap = styled.div`
    height: 50px;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
    @media (max-width: 768px) {
      height: 40px;
    }
  `,
  BtnWrap = styled.div`
    height: 50px;
    margin-top: 10px;
    @media (max-width: 768px) {
      height: 40px;
    }
  `,
  Menu = styled.div`
    display: flex;
    color: ${COLORS.LIGHT};
    margin-bottom: 10px;
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
      font-size: 12px;
      text-align: center;
      margin-right: 5px;
    }
  `,
  Upload = styled(DOTS)`
    color: ${COLORS.LIGHT};
    display: flex;
    align-items: center;
    margin-top: 10px;
    font-size: 16px;
    @media (max-width: 768px) {
      font-size: 12px;
    }
  `,
  CustomUploadInput = styled.div`
    padding: 12px;
    cursor: pointer;
    background: ${COLORS.LIGHT_DARK};
    border-radius: 5px;
    text-transform: uppercase;
    margin-right: 10px;
  `,
  UploadInput = styled.input`
    display: none;
  `,
  AboutBlock = styled.div`
    text-indent: 30px;
    margin-bottom: 10px;
    font-weight: ${({ bold }) => bold && "bold"};
    &:last-child {
      margin-bottom: 0;
    }
  `,
  ImgText = styled(DOTS)``;

export const Info = () => {
  const dispatch = useDispatch();
  const { loading, name, subject, message, files, email } = useSelector(
      (st) => st.info
    ),
    { isLoading, lng } = useSelector((st) => st.common);

  const [pages, setPages] = useState({
      contacts: true,
      // faq: false,
      "about us": false,
    }),
    [loaded, setLoaded] = useState(false);

  const input = useRef(null);

  useEffect(() => {
    document.title = "for test | Info";

    loadReCaptcha("6LfOZZYeAAAAAEytTbPSXiyDx-SIsXtWy__ZJnti")
      .then(() => setLoaded(true))
      .catch((e) => setLoaded(false));

    dispatch(infoActions.clearContacts());

    toggleCaptchaBadge(true);
    return () => toggleCaptchaBadge(false);
  }, []);

  useEffect(() => {
    pages.contacts ? toggleCaptchaBadge(true) : toggleCaptchaBadge(false);
  }, [pages, isLoading]);

  const btnClick = (key) => {
      const obj = pages;
      for (let newKey in obj) obj[newKey] = false;
      obj[key] = true;
      setPages({
        ...obj,
      });
    },
    save = async () => {
      if (name && subject && message && email) {
        const gtoken = await reCaptchaExecute(
          "6LfOZZYeAAAAAEytTbPSXiyDx-SIsXtWy__ZJnti",
          "auth"
        );
        dispatch(infoActions.fetchSendMail(gtoken));
      } else {
        dispatch(
          commonActions.setErr({
            ownErr: txt[lng].err.sentmail,
          })
        );
      }
    },
    toggleCaptchaBadge = (show) => {
      const badge = document.getElementsByClassName("grecaptcha-badge")[0];
      if (badge && badge instanceof HTMLElement) {
        badge.style.visibility = show ? "visible" : "hidden";
      }
    };

  return (
    <Container>
      <Header />

      <Content>
        <Menu>
          {Object.keys(pages).map((key) => (
            <MenuBtn
              key={key}
              active={pages[key]}
              onClick={() => btnClick(key)}
            >
              {txt[lng].info[key]}
            </MenuBtn>
          ))}
        </Menu>

        {pages["about us"] && <Page></Page>}

        {/* {pages["faq"] && <Accord />} */}

        {pages["contacts"] && (
          <ContactForm>
            <InputWrap>
              <SearchInput
                placeholder={`${txt[lng].info.name}*`}
                name={"name"}
                value={name}
                changeText={(txt) => dispatch(infoActions.setName(txt))}
              />
            </InputWrap>
            <InputWrap>
              <SearchInput
                placeholder={`${txt[lng].info.email}*`}
                name={"email"}
                value={email}
                changeText={(txt) => dispatch(infoActions.setEmail(txt))}
              />
            </InputWrap>
            <InputWrap>
              <SearchInput
                placeholder={`${txt[lng].info.subject}*`}
                name={"subject"}
                value={subject}
                changeText={(txt) => dispatch(infoActions.setSubject(txt))}
              />
            </InputWrap>

            <TextArea
              placeholder={`${txt[lng].info.message}*`}
              value={message}
              changeText={(txt) => dispatch(infoActions.setMessage(txt))}
              max={1000}
            />

            <Upload>
              <CustomUploadInput
                onClick={() => input.current && input.current.click()}
              >
                {files ? txt[lng].info.change : txt[lng].info.upload}
                <UploadInput
                  multiple={true}
                  ref={input}
                  accept="image/x-png, image/png, image/jpg, image/jpeg, .doc, .docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  type="file"
                  onChange={(event) =>
                    dispatch(infoActions.setFiles(event.target.files))
                  }
                />
              </CustomUploadInput>

              {files ? (
                <ImgText>
                  {Object.keys(files).map((key) => {
                    if (key < 3) {
                      return <p key={files[key].name}>{files[key].name}</p>;
                    } else {
                      return "";
                    }
                  })}
                </ImgText>
              ) : (
                <ImgText></ImgText>
              )}
            </Upload>

            {loaded && (
              <BtnWrap>
                <Btn active text={txt[lng].info.send} click={save} />
              </BtnWrap>
            )}
          </ContactForm>
        )}
      </Content>

      {(loading || isLoading) && <Loader />}
    </Container>
  );
};
