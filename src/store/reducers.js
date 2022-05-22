import { combineReducers } from "redux";
import { mainPlacesReducer as mainPlaces } from "./mainPlaces";
import { companyPlaceReducer as companyPlace } from "./companyPlace";
import { mapPlacesReducer as mapPlaces } from "./mapPlaces";
import { geolocationReducer as geolocation } from "./geolocation";
import { authReducer as auth } from "./authenticate";
import { listReducer as list } from "./list";
import { commonReducer as common } from "./common";
import { settingsReducer as settings } from "./settings";
import { profileReducer as profile } from "./profile";
import { streamReducer as stream } from "./stream";
import { sidebarReducer as sidebar } from "./sidebar";
import { workSchReducer as workSch } from "./workSch";
import { infoReducer as info } from "./info";

export const reducers = combineReducers({
  mainPlaces,
  companyPlace,
  mapPlaces,
  geolocation,
  auth,
  list,
  common,
  settings,
  profile,
  stream,
  sidebar,
  workSch,
  info,
});
