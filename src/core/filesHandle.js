import { getBibleAsJson } from "../api/getData";
import rvrBible  from "../db/rvr.json";

function getBibleData() {
  const input = document.getElementById("bible-version").value;
  switch (input) {
    case "rvr":
      return rvrBible;
    case "kdsh":
      return getBibleAsJson("kdsh");
    default:
      return rvrBible;
  }
}

export { getBibleData };
