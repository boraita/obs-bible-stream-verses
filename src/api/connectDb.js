import initSqlJs from '../lib/sql-asm.js';

export async function openDb(dbFile) {
  const SQL = await initSqlJs();
  return new SQL.Database(new Uint8Array(dbFile));
}
