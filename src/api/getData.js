import { openDb } from "./connectDb.js";
import kdsh from "../db/KDSH.sqlite";

export let openedDb;
export let selectedBibleName;

export function selectBible(name) {
  if (openedDb) {
    openedDb.close();
  }
  switch (name) {
    case "kdsh":
      openedDb = openDb(kdsh);
      selectedBibleName = "kdsh";
      break;
  }
}

export function getBibleAsJson(bibleName) {
  if (bibleName !== selectedBibleName) {
    selectBible(bibleName);
  }
  if (openedDb) {
    // return openedDb.exec(
    //   "SELECT books.book_number || ':' || verses.chapter || ':' || verses.verse as ari,    books.long_name || ' ' || verses.chapter || ':' || verses.verse as name,    verses.text as verse FROM books JOIN verses ON books.book_number = verses.book_number ORDER BY books.book_number, verses.chapter, verses.verse LIMIT 10;"
    // );
  }
}
