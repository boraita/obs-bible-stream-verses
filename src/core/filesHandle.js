import { rvrBible } from "../bibles/rvr";

function getBibleData() {
  const input = document.getElementById("bible-version").value;
  switch (input) {
    case "rvr":
      return rvrBible;
    default:
      return rvrBible;
  }
}

export { getBibleData };
