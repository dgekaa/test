export const GET_PLACES = `data {
    id name address  images {id url} lat lon alias
    streams{ id user_preview online{ is_online }  schedules{id day start_time} see_you_tomorrow online_on blur }
    currentScheduleInterval {start_time end_time}
    is_work
    is_online
    distance
    categories {id name slug}
    city {id name slug lat lon}
  }`;

export const PAGINATOR_INFO = `
  paginatorInfo{
    hasMorePages lastItem total count currentPage firstItem lastPage perPage
  }
  `;

export const GET_ADMIN_PLACES = `data {id name alias disabled categories{name } city {id name} user {id type email name places{id name alias }} streams{ id online_on}}`;
export const GET_SETTINGS_PLACES = `data {id name }`;

export const GET_CLIENT_PLACES = `id name alias disabled categories{name } city {id name} user {id type email name} streams{ id online_on}`;
