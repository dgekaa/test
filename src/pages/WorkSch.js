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
  Popup,
  TimePicker,
} from "../components";
import { useParams } from "react-router-dom";
import { workSchActions } from "../store/workSch";
import { DAY_NEXT, DAY_NUM_TO_PREV_NUM } from "../other/constants";
import { addZero, curDayTimeMin, getCurDay, toMin } from "../other/functions";
import { DOTS } from "../other/styles";
import { NavBtns, ToPlace } from "./Profile";

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
    width: 1000px;
    padding-top: 65px;
    @media (max-width: 768px) {
      width: calc(100% - 20px);
      padding-top: 60px;
      margin: 0 10px;
    }
  `,
  Table = styled.div`
    background: ${COLORS.DARK};
    width: 100%;
    margin-top: 15px;
    padding: 10px;
    border-radius: 5px;
    color: ${COLORS.LIGHT};
    @media (max-width: 768px) {
    }
  `,
  Col = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    opacity: ${({ disabled }) => disabled && 0.3};
    &:first-child {
      margin-top: 0px;
    }
    @media (max-width: 768px) {
    }
  `,
  HeadCol = styled(Col)`
    font-weight: bold;
    margin-bottom: 10px;
    @media (max-width: 768px) {
    }
  `,
  DayRow = styled.div`
    flex: 1;
    padding: 5px;
    border-radius: 5px;
    text-align: center;
    margin-right: 10px;
    background: ${COLORS.LIGHT_DARK};
    color: ${({ cur }) => cur && COLORS.WARNING_COLOR};
    font-weight: ${({ cur }) => cur && "bold"};
  `,
  Row = styled(DOTS)`
    flex: 1;
    padding: 5px;
    border-radius: 5px;
    text-align: center;
    margin-right: 10px;
    background: ${COLORS.LIGHT_DARK};
    position: relative;
    font-weight: ${({ cur }) => cur && "bold"};
    color: ${({ closed }) =>
      closed ? COLORS.ERROR_COLOR : COLORS.SUCCESS_COLOR};

    &:hover {
      opacity: 0.7;
    }

    &:first-child {
      flex: 1;
      &:hover {
        opacity: 1;
      }
    }

    &:nth-child(2) {
      cursor: pointer;
      flex: 2;
    }

    &:nth-child(3) {
      cursor: pointer;
      flex: 2;
    }

    &:last-child {
      cursor: pointer;
      margin-right: 0;
    }

    @media (max-width: 768px) {
      /* width: 100px; */
    }
  `,
  HeadRow = styled(Row)`
    color: ${COLORS.LIGHT};
    text-transform: uppercase;
    &:first-child {
      visibility: hidden;
    }
    &:nth-child(2) {
      &:hover {
        opacity: 1;
        cursor: default;
      }
    }
    &:nth-child(3) {
      &:hover {
        opacity: 1;
        cursor: default;
      }
    }
    &:last-child {
      visibility: hidden;
    }
  `,
  Time = styled.div`
    display: flex;
    flex: 1;
    margin: 10px 0;
    height: 250px;
    @media (max-width: 768px) {
    }
  `,
  SaveBtn = styled.div`
    display: flex;
    flex: 1;
    height: 50px;
    @media (max-width: 768px) {
      height: 40px;
    }
  `;

export const WorkSch = () => {
  const dispatch = useDispatch();
  const { alias } = useParams();

  const { isLoading, lng } = useSelector((st) => st.common),
    { loading, place, isTimePP, timeInfo } = useSelector((st) => st.workSch);

  const [curDay, setCurDay] = useState();

  useEffect(() => {
    document.title = "for test | Work schedule";
    dispatch(workSchActions.fetchPlace(alias));
  }, []);

  const sch = place && place.schedules && place.schedules;

  useEffect(() => {
    if (sch) {
      sch.forEach((day, i) => {
        const prevEndMin = toMin(sch[DAY_NUM_TO_PREV_NUM[i]].end_time),
          prevStartMin = toMin(sch[DAY_NUM_TO_PREV_NUM[i]].start_time),
          isPrevWeekend = sch[DAY_NUM_TO_PREV_NUM[i]].weekend;

        if (getCurDay() === i) {
          if (
            curDayTimeMin() < prevEndMin &&
            prevEndMin <= prevStartMin &&
            !isPrevWeekend
          ) {
            setCurDay(DAY_NUM_TO_PREV_NUM[i]);
          } else {
            setCurDay(i);
          }
        }
      });
    }
  }, [place]);

  const closeOpen = (day, alias) => {
      dispatch(
        workSchActions.fetchUpdateWeekend(day.id, day.weekend ? 0 : 1, alias)
      );
    },
    tglTimePP = (bool, day, isStart) => {
      dispatch(
        workSchActions.setTimeInfo(
          day
            ? {
                isStart: isStart ? true : false,
                id: day.id,
                time: isStart ? day.start_time : day.end_time,
                day,
              }
            : { isStart: false, id: null, time: null, day: null }
        )
      );
      dispatch(workSchActions.tglTimePP(bool));
    },
    saveTime = () => dispatch(workSchActions.fetchUpdateTime(alias)),
    click = (isTop, isHour) => {
      const arr = timeInfo.time.split(":"),
        hh = arr[0],
        mm = arr[1],
        hNum = Number(hh),
        mNum = Number(mm),
        maxM = 55,
        maxH = 23;

      let newTime = "";

      if (isTop) {
        if (isHour) {
          newTime = hNum < maxH ? `${addZero(hNum + 1)}:${mm}` : `00:${mm}`;
        } else {
          newTime = mNum < maxM ? `${hh}:${addZero(mNum + 5)}` : `${hh}:00`;
        }
      } else {
        if (isHour) {
          newTime = hNum !== 0 ? `${addZero(hNum - 1)}:${mm}` : `${maxH}:${mm}`;
        } else {
          newTime = mNum !== 0 ? `${hh}:${addZero(mNum - 5)}` : `${hh}:${maxM}`;
        }
      }

      dispatch(
        workSchActions.setTimeInfo({
          ...timeInfo,
          time: newTime,
        })
      );
    };

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
        <AdminNav active="worksch" />
        {sch && (
          <Table>
            <HeadCol>
              <HeadRow></HeadRow>
              <HeadRow>{txt[lng].streamsch.startt}</HeadRow>
              <HeadRow>{txt[lng].streamsch.endt}</HeadRow>
              <HeadRow></HeadRow>
            </HeadCol>

            {sch.map((day, i) => {
              const weekend = day.weekend,
                start = day.start_time,
                end = day.end_time,
                DD =
                  toMin(start) >= toMin(end) && toMin(end) !== 0
                    ? `${txt[lng].streamsch[day.day]}-${
                        txt[lng].streamsch[DAY_NEXT[day.day]]
                      }`
                    : txt[lng].streamsch[day.day];

              return (
                <Col key={day.day}>
                  <DayRow cur={curDay === i}>{DD}</DayRow>
                  <Row
                    closed={weekend}
                    onClick={() => tglTimePP(true, day, true)}
                  >
                    {start}
                  </Row>
                  <Row
                    closed={weekend}
                    onClick={() => tglTimePP(true, day, false)}
                  >
                    {end}
                  </Row>
                  <Row closed={weekend} onClick={() => closeOpen(day, alias)}>
                    {weekend
                      ? txt[lng].streamsch.closed
                      : txt[lng].streamsch.opened}
                  </Row>
                </Col>
              );
            })}
          </Table>
        )}
      </Content>

      <Popup
        visible={isTimePP}
        header={`${txt[lng].streamsch.save} ${
          timeInfo.isStart ? txt[lng].streamsch.start : txt[lng].streamsch.end
        } ${txt[lng].streamsch.timeto} "${
          timeInfo.day && txt[lng].streamsch[timeInfo.day.day]
        }"`}
        close={() => tglTimePP(false)}
        content={
          <Time>
            <TimePicker time={timeInfo.time} click={click} />
          </Time>
        }
        footer={
          <SaveBtn>
            <Btn
              active
              text={txt[lng].streamsch.save}
              click={() => saveTime()}
            />
          </SaveBtn>
        }
      />

      {(loading || isLoading) && <Loader />}
    </Container>
  );
};
