import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
let db: Database | undefined = undefined;

async function initialize(path: string, favListId: string) {
  db = await open({
    filename: path,
    driver: sqlite3.Database,
  });
  await db.run(
    `CREATE TABLE IF NOT EXISTS bili_music_sync_${favListId} (bvid TEXT PRIMARY KEY UNIQUE ON CONFLICT REPLACE, audio_file_path TEXT);`
  );
}

async function getAudioFilePathByBvid(
  bvid: string,
  favListId: string
): Promise<string> {
  if (!db) throw "Database not available";
  let res = await db.get(
    `SELECT bvid,audio_file_path FROM bili_music_sync_${favListId} WHERE bvid = ?;`,
    bvid
  );
  return res?.["audio_file_path"];
}

async function setItem(bvid: string, audioFilePath: string, favListId: string) {
  if (!db) throw "Database not available";
  await db.run(
    `INSERT INTO bili_music_sync_${favListId} (bvid, audio_file_path) VALUES (?, ?);`,
    bvid,
    audioFilePath
  );
}

async function getAllBvids(favListId: string): Promise<string[]> {
  if (!db) throw "Database not available";
  let res = await db.all(`SELECT bvid FROM bili_music_sync_${favListId}`);
  return res.map((v) => v.bvid);
}

async function removeByBvid(bvid: string, favListId: string) {
  if (!db) throw "Database not available";
  await db.run(
    `DELETE FROM bili_music_sync_${favListId} WHERE bvid = ?;`,
    bvid
  );
}

export default {
  initializeDatabase: initialize,
  getAudioFilePathByBvid,
  setItem,
  getAllBvids,
  removeByBvid,
};
