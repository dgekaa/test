import { DAY_NUM_TO_PREV_NUM } from "./constants";
import { QUERY_PATH } from "./settings";

export const getWorkTime = (is_work, currentScheduleInterval) => {
  if (is_work && currentScheduleInterval) {
    const { start_time, end_time } = currentScheduleInterval,
      start = start_time.slice(10, 16),
      end = end_time.slice(10, 16);
    if (start === end) {
      return "24h";
    } else {
      return `${start} - ${end}`;
    }
  }
  return " closed";
};

export const isOnline = (streams) => {
  if (!streams.length) return false;

  for (let i = 0; i < streams.length; i++) {
    if (streams[i].online.is_online) return true;
  }

  return false;
};

export const isOnlineOn = (str) => (str ? str.online_on : false);

export const isBlur = (streams) => {
  if (!streams.length) return false;

  for (let i = 0; i < streams.length; i++) {
    if (streams[i].online.is_online && streams[i].blur) return streams[i].blur;
  }

  return false;
};

export const getProfileUserImage = (images, streams, w, h) => {
  for (let i = 0; i < streams.length; i++) {
    if (streams[i].online.is_online) {
      return `url(${streams[i].user_preview})`;
    } else if (images[0] && i === streams.length - 1) {
      return `url(${QUERY_PATH}/imgcache/${w}/${h}/storage/${images[0].url})`;
    }
  }

  if (images[0])
    return `url(${QUERY_PATH}/imgcache/${w}/${h}/storage/${images[0].url})`;

  return `url(${process.env.PUBLIC_URL}/img/nophoto.jpg)`;
};

export const toMin = (time) => {
  const h = Number(time.split(":")[0]),
    m = Number(time.split(":")[1]);

  return h * 60 + m;
};

export const curDayTimeMin = () => {
  const today = new Date(),
    time = today.getHours() + ":" + today.getMinutes();
  return toMin(time);
};

export const curTimeMs = () => {
  const today = new Date();
  return today.getTime();
};

export const getCurDay = () => {
  const today = new Date().getDay();
  return DAY_NUM_TO_PREV_NUM[today];
};

export const todayYMD = () => {
  const date = new Date();

  const y = date.getFullYear(),
    m = addZero(date.getMonth() + 1),
    d = addZero(date.getDate());

  return `${y}-${m}-${d}`;
};

export const tomorrowYMD = () => {
  const date = new Date();

  date.setDate(date.getDate() + 1);

  const y = date.getFullYear(),
    m = addZero(date.getMonth() + 1),
    d = addZero(date.getDate());

  return `${y}-${m}-${d}`;
};

export const addZero = (time) => {
  const num = Number(time);

  return num <= 9 ? "0" + num : "" + num;
};
