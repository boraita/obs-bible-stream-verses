import initSqlJs from '../lib/sql-asm.js';

export async function openDb(dbFile) {
  return await initSqlJs()
    .then((SQL) => new SQL.Database(new Uint8Array(dbFile)))
}
