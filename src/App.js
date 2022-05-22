import "./App.css";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  Main,
  Company,
  Map,
  Login,
  List,
  Profile,
  Settings,
  Stream,
  WorkSch,
  Info,
} from "./pages";
import {
  Err,
  PoliticPopup,
  PrivateRoute,
  SideBar,
  UnprivateRoute,
} from "./components";
import { COLORS } from "./other/constants";
import { useDispatch, useSelector } from "react-redux";
import { commonActions } from "./store/common";
import { useEffect } from "react";
import { useAnalytics } from "use-analytics";

const Container = styled.div`
  background-color: ${COLORS.LIGHT_DARK};
`;

const App = () => {
  const dispatch = useDispatch();

  const { errors, isCookPP, ok } = useSelector((st) => st.common);

  const location = useLocation();
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.page();
  }, [location]);

  useEffect(() => {
    dispatch(commonActions.fetchCities(true));
  }, []);

  return (
    <Container>
      <SideBar />
      <Err err={errors} ok={ok} />
      <PoliticPopup visible={isCookPP} />
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route path="/info" element={<Info />} />
        <Route path="place/:alias" element={<Company />} />
        <Route path="/map/:ll/:z/:id/:name" element={<Map />} />
        <Route
          path="/login"
          element={
            <UnprivateRoute>
              <Login />
            </UnprivateRoute>
          }
        />
        <Route
          path="/list"
          element={
            <PrivateRoute>
              <List />
            </PrivateRoute>
          }
        />
        <Route
          path="/list/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/:alias/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/:alias/stream"
          element={
            <PrivateRoute>
              <Stream />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/:alias/worksch"
          element={
            <PrivateRoute>
              <WorkSch />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Container>
  );
};

export default App;
