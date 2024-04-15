import { kadoshBible } from "../bibles/kadosh";
import { rvrBible } from "../bibles/rvr";

function getBibleData() {
  const input = document.getElementById("bible-version").value;
  switch (input) {
    case "rvr":
      return rvrBible;
    case "kadosh":
      return kadoshBible;
    default:
      return rvrBible;
  }
}

export { getBibleData };
