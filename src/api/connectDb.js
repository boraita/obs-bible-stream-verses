import initSqlJs from "/src/lib/sql-asm.js";

export function openDb(dbFile) {
  return initSqlJs().then((SQL) => {
    return new SQL.Database(new Uint8Array(dbFile));

    const select = db.exec(
      "SELECT books.book_number || ':' || verses.chapter || ':' || verses.verse as ari,    books.long_name || ' ' || verses.chapter || ':' || verses.verse as name,    verses.text as verse FROM books JOIN verses ON books.book_number = verses.book_number ORDER BY books.book_number, verses.chapter, verses.verse LIMIT 10;"
    );
    console.log(select);
  });
}
