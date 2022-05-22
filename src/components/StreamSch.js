import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Btn, TimePicker, Popup } from ".";
import { useParams } from "react-router-dom";
import { streamActions } from "../store/stream";
import { Col, Row, HeadCol, HeadRow, DayRow, Time } from "../pages/WorkSch";
import styled from "styled-components";
import {
  COLORS,
  DAY_NEXT,
  DAY_NUM_TO_NEXT_NUM,
  DAY_NUM_TO_PREV_NUM,
  txt,
} from "../other/constants";
import {
  addZero,
  curDayTimeMin,
  getCurDay,
  todayYMD,
  toMin,
  tomorrowYMD,
} from "../other/functions";
import Switch from "react-switch";

const Content = styled.div``,
  SwitchContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
  `,
  Table = styled.div`
    background: ${COLORS.DARK};
    width: 100%;
    margin-top: 15px;
    border-radius: 5px;
    color: ${COLORS.LIGHT};
  `,
  SwitchText = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding-bottom: 4px;
  `,
  SwitchStyled = styled(Switch)`
    margin-left: 10px;
    margin-right: 10px;
  `,
  Bold = styled.span`
    font-weight: bold;
  `,
  SaveBtn = styled.div`
    display: flex;
    flex: 1;
    height: 50px;
    @media (max-width: 768px) {
      height: 40px;
    }
  `;

export const StreamSch = ({ str, index }) => {
  const dispatch = useDispatch();
  const { alias } = useParams();

  const { lng } = useSelector((st) => st.common),
    { isTimePP, timeInfo, isSwitch } = useSelector((st) => st.stream);

  const [curDay, setCurDay] = useState(),
    [curDate, setCurDate] = useState(),
    [curEndTime, setCurEndTime] = useState(),
    [isTomorrow, setIsTomorrow] = useState(false),
    [disCur, setDisCur] = useState(),
    [disPrev, setDisPrev] = useState(),
    [disNext, setDisNext] = useState();

  useEffect(() => {
    if (str.schedules) {
      str.schedules.forEach((day, i) => {
        const prevEndMin = toMin(
            str.schedules[DAY_NUM_TO_PREV_NUM[i]].end_time
          ),
          prevStartMin = toMin(
            str.schedules[DAY_NUM_TO_PREV_NUM[i]].start_time
          ),
          isPrevWeekend = str.schedules[DAY_NUM_TO_PREV_NUM[i]].weekend;

        if (getCurDay() === i) {
          if (
            curDayTimeMin() < prevEndMin &&
            prevEndMin <= prevStartMin &&
            !isPrevWeekend
          ) {
            setCurDay(DAY_NUM_TO_PREV_NUM[i]); // вчера id дня
            setCurDate(todayYMD()); // вчера дата сег-го дня
            setCurEndTime(`${str.schedules[DAY_NUM_TO_PREV_NUM[i]].end_time}`); // вчера end_time дня
          } else {
            setCurDay(i); // сегодня id дня
            setCurDate(
              toMin(day.start_time) < toMin(day.end_time)
                ? todayYMD()
                : tomorrowYMD()
            ); //  дата сег-го или завт-го дня
            setIsTomorrow(toMin(day.start_time) >= toMin(day.end_time)); // если завтрашний день
            setCurEndTime(`${day.end_time}`); // сегодня end_time дня
          }
        }
      });
    }
  }, [str]);

  useEffect(() => {
    if (curDay && isSwitch[index]) {
      setDisPrev(DAY_NUM_TO_PREV_NUM[curDay]);
      setDisNext(DAY_NUM_TO_NEXT_NUM[curDay]);
      setDisCur(curDay);
    } else {
      setDisPrev();
      setDisNext();
      setDisCur();
    }
  }, [curDay, isSwitch[index]]);

  const closeOpen = (day, alias) => {
      dispatch(
        streamActions.fetchUpdateWeekend(day.id, day.weekend ? 0 : 1, alias)
      );
    },
    tglTimePP = (bool, day, isStart) => {
      dispatch(
        streamActions.setTimeInfo(
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
      dispatch(streamActions.tglTimePP(bool));
    },
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
        streamActions.setTimeInfo({
          ...timeInfo,
          time: newTime,
        })
      );
    },
    saveTime = () => {
      // const saveTimeMin = toMin(timeInfo.time),
      //   nextDayStart = sch[DAY_NUM[DAY_NEXT[timeInfo.day.day]]].start_time,
      //   prevDayStart = sch[DAY_NUM[DAY_PREV[timeInfo.day.day]]].start_time,
      //   prevDayEnd = sch[DAY_NUM[DAY_PREV[timeInfo.day.day]]].end_time,
      //   nextDayStartMin = toMin(nextDayStart),
      //   prevDayStartMin = toMin(prevDayStart),
      //   prevDayEndMin = toMin(prevDayEnd);

      // if (timeInfo.isStart) {
      //   if (prevDayStartMin >= prevDayEndMin && saveTimeMin < prevDayEndMin) {
      //     alert("ВРЕМЯ ЗАЛЕЗАЕТ НА ПРЕД ДЕНЬ " + prevDayEnd);
      //   } else {
      //     dispatch(streamActions.fetchUpdateTime(alias));
      //   }
      // } else {
      //   if (
      //     saveTimeMin <= toMin(timeInfo.day.start_time) &&
      //     saveTimeMin > nextDayStartMin
      //   ) {
      //     alert("ВРЕМЯ ЗАЛЕЗАЕТ НА СЛЕД ДЕНЬ " + nextDayStart);
      //   } else {
      //     dispatch(streamActions.fetchUpdateTime(alias));
      //   }
      // }
      dispatch(streamActions.fetchUpdateTime(alias));
    },
    onChange = (bool) => {
      const prevYear = "2020-12-28 00:00";
      bool
        ? dispatch(
            streamActions.fetchUpdateSeeYou(
              str.id,
              `${curDate} ${curEndTime}`,
              alias
            )
          )
        : dispatch(streamActions.fetchUpdateSeeYou(str.id, prevYear, alias));
    },
    getSwitchText = () => {
      if (isSwitch[index]) {
        const seeYou = str.see_you_tomorrow;
        return (
          <p>
            {txt[lng].streamsch.disableto}{" "}
            <Bold>{seeYou && seeYou.slice(0, 16)}</Bold>
          </p>
        );
      } else {
        return (
          <p>
            {txt[lng].streamsch.disable}{" "}
            <Bold> {txt[lng].streamsch[str.schedules[curDay].day]}</Bold>{" "}
            {txt[lng].streamsch.streamto}{" "}
            <Bold>{str.schedules[curDay].end_time}</Bold>
          </p>
        );
      }
    },
    getSwitch = (sch) => {
      if (curDay || curDay === 0) {
        if (!sch[curDay].weekend) {
          // не выходной
          if (curDayTimeMin() < toMin(curEndTime) || isTomorrow) {
            // текущее время меньше end_time или завтраний день в end_time
            return (
              <SwitchContainer>
                <SwitchText>{getSwitchText()}</SwitchText>
                <SwitchStyled
                  checked={isSwitch[index]}
                  onChange={onChange}
                  offColor={COLORS.ERROR_COLOR}
                  onColor={COLORS.SUCCESS_COLOR}
                />
              </SwitchContainer>
            );
          }
        }
      }
    };

  return (
    <Content>
      {str.schedules && (
        <Table>
          <HeadCol>
            <HeadRow></HeadRow>
            <HeadRow>{txt[lng].streamsch.startt}</HeadRow>
            <HeadRow>{txt[lng].streamsch.endt}</HeadRow>
            <HeadRow></HeadRow>
          </HeadCol>

          {str.schedules.map((day, i) => {
            const weekend = day.weekend,
              start = day.start_time,
              end = day.end_time,
              DD =
                toMin(start) >= toMin(end) && toMin(end) !== 0
                  ? `${txt[lng].streamsch[day.day]}-${
                      txt[lng].streamsch[DAY_NEXT[day.day]]
                    }`
                  : txt[lng].streamsch[day.day],
              dis = disCur !== i && disPrev !== i && disNext !== i;

            return (
              <Col disabled={!dis} key={day.day}>
                <DayRow cur={curDay === i}>{DD}</DayRow>
                <Row
                  closed={weekend}
                  onClick={() => dis && tglTimePP(true, day, true)}
                >
                  {start}
                </Row>
                <Row
                  closed={weekend}
                  onClick={() => dis && tglTimePP(true, day, false)}
                >
                  {end}
                </Row>
                <Row
                  closed={weekend}
                  onClick={() => dis && closeOpen(day, alias)}
                >
                  {weekend
                    ? txt[lng].streamsch.closed
                    : txt[lng].streamsch.opened}
                </Row>
              </Col>
            );
          })}
          {getSwitch(str.schedules)}
        </Table>
      )}

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
    </Content>
  );
};

// const seeYou = place.streams[0].see_you_tomorrow;
// if (seeYou) {
//   const seeYouDay = new Date(seeYou).toLocaleString("en-us", {
//       weekday: "short",
//     }),
//     seYouMs = new Date(seeYou).getTime();

//   console.log(timeInfo, "====INFO====");
//   console.log(seeYouDay, "=seeYouDays");
//   console.log(seYouMs > curTimeMs(), "=seYouMs>curTimeMs");

//   if (seYouMs > curTimeMs()) {
//     maxM = 55;
//     maxH = 23;
//   }
// }
