// /src/infrastructure/db.ts
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
let db;
export async function initializeDatabase() {
    if (db) {
        return db;
    }
    db = await open({
        filename: './scheduler.db',
        driver: sqlite3.Database,
    });
    await db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      startDatetime TEXT NOT NULL,
      endDatetime TEXT NOT NULL,
      description TEXT NOT NULL
    );
  `);
    return db;
}
//# sourceMappingURL=db.js.map