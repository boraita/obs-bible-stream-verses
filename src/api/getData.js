import { openDb } from "./connectDb.js";
import kdsh from "../db/KDSH.sqlite";
import btx from "../db/BTX.sqlite";
import nvi from "../db/NVI.sqlite";
import nvic from "../db/NVIC.sqlite";
import btx4 from "../db/BTX4.sqlite";

export let openedDb;
export let selectedBibleName = "kdsh";

export async function selectBible(name) {
  if (openedDb) {
    await openedDb.close();
  }
  switch (name) {
    case "kdsh":
      openedDb = await openDb(kdsh);
      selectedBibleName = "kdsh";
      break;
    case "btx":
      openedDb = await openDb(btx);
      selectedBibleName = "btx";
      break;
    case "nvi":
      openedDb = await openDb(nvi);
      selectedBibleName = "nvi";
      break;
    case "nvic":
      openedDb = await openDb(nvic);
      selectedBibleName = "nvic";
      break;
    case "btx4":
      openedDb = await openDb(btx4);
      selectedBibleName = "btx4";
      break;
  }
  return openedDb;
}
export function closeDb() {
  openedDb.close();
}

export async function getBibleAsJson(bibleName) {
  if (!openedDb && bibleName !== selectedBibleName) {
    openedDb = await selectBible(bibleName);
  }
  const db = openedDb ?? null;
  if (db) {
    const query = db.exec(
      "SELECT books.book_number || ':' || verses.chapter || ':' || verses.verse as ari,    books.long_name || ' ' || verses.chapter || ':' || verses.verse as name,    verses.text as verse FROM books JOIN verses ON books.book_number = verses.book_number ORDER BY books.book_number, verses.chapter, verses.verse LIMIT 10;"
    );
    const response =
      query?.[0].values.map((item) => ({
        ari: item[0],
        name: item[1],
        verse: item[2],
      }))?.values ?? [];
    return response;
  }
}

export async function getBibleChapterBooksList() {
  if (!openedDb) {
    openedDb = await selectBible(selectedBibleName);
  }
  const db = openedDb ?? null;
  if (db) {
    const query = await db.exec(
      `SELECT books.long_name || ' ' || verses.chapter as bookVerse
      FROM books
      JOIN verses
      ON books.book_number = verses.book_number
      GROUP BY books.book_number, verses.chapter
      ORDER BY books.book_number, verses.chapter;`
    );
    return query?.[0].values.flatMap((p) => p) ?? [];
  }
}
export async function searchCharacters(chapterBook) {
  if (!openedDb) {
    openedDb = await selectBible(selectedBibleName);
  }
  const db = openedDb ?? null;
  if (db) {
    const splitted = chapterBook.split(" ");
    const isVerseNumber = !isNaN(+splitted?.[splitted.length - 1]);
    const book = isVerseNumber
      ? splitted.slice(0, splitted.length - 1).join(" ")
      : splitted.join(" ");
    const verse = isVerseNumber
      ? ` and verses.chapter LIKE '${+splitted?.[splitted.length - 1]}'`
      : "";
    const query = `SELECT verses.chapter, verses.verse, verses.text, books.long_name
    FROM books
    JOIN verses
    ON books.book_number = verses.book_number
    WHERE books.long_name LIKE '%${book}%'${verse}
    ORDER BY verses.verse;`;
    const result = await openedDb.exec(query);
    return (
      result?.[0]?.values.flatMap((p) => ({
        name: `${p[3]} ${p[0]}:${p[1]}`,
        verse: p[2],
      })) ?? []
    );
  }
}

export async function searchInBibleText(text) {
  if (!openedDb) {
    openedDb = await selectBible(selectedBibleName);
  }
  const db = openedDb ?? null;
  if (db) {
    const query = `SELECT verses.chapter, verses.verse, verses.text, books.long_name
    FROM books
    JOIN verses
    ON books.book_number = verses.book_number
    WHERE verses.text LIKE '%${text}%'
    ORDER BY books.book_number, verses.chapter, verses.verse;`;
    console.log(query);
    const response = await openedDb.exec(query);
    return (
      response?.[0]?.values.flatMap((p) => ({
        name: `${p[3]} ${p[0]}:${p[1]}`,
        verse: p[2],
      })) ?? []
    );
  }
}
