import { openDb } from "./connectDb.js";
import kdsh from "/src/db/KDSH.sqlite";

export let openedDb;

export function selectBible(name) {
  if (openedDb) {
    openedDb.close();
  }
  switch (name) {
    case "kdsh":
      openedDb = openDb(kdsh);
      break;
  }
}
