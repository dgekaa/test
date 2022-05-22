import { QUERY_PATH } from "./settings";

const QUERY = async (body) => {
  const response = await fetch(`${QUERY_PATH}/graphql`, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(body),
    headers: {
      "Access-Control-Allow-Origin": QUERY_PATH,
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
        ? "Bearer " + localStorage.getItem("token")
        : "",
    },
  });

  return await response.json();
};

export default QUERY;
