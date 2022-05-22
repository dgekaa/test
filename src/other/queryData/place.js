export const PLACE_EXT_DATA_QUERY_FOR_ALIAS = ` 
  id name address adult  images{id url description} lat lon distance socials {id name url}
  streams{ id online {is_online } 
  user_preview user_url blur default_sound_volume online_on schedules{id day start_time}}
  currentScheduleInterval {start_time end_time}
  schedules{id day start_time end_time weekend }
  is_work
  city {id name lat lon}
  is_online
  description
  categories {id name slug}
`;

export const PLACE_DATA_QUERY_FOR_ALIAS_PROFILE = ` 
  id name address alias disabled adult images{id url description} socials {id name url} lat lon description
  city {id name lat lon}
  categories {id name slug}
  streams {id}
`;

export const PLACE_DATA_QUERY_FOR_ALIAS_STREAM = ` 
  id name alias disabled
  streams 
    { 
      id name preview url rtmp_url see_you_tomorrow blur online_on default_sound_volume
      schedules{id day start_time end_time weekend }
    }
`;

export const PLACE_DATA_QUERY_FOR_ALIAS_WORK_SCH = ` 
  id name alias disabled
  streams { id }
  schedules{id day start_time end_time weekend}
`;
