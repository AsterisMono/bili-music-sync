import youtubedl, { YtFlags, YtResponse } from "youtube-dl-exec";
import fetch from "node-fetch";
import { FavList } from "./interfaces/bilibiliFavApi";
import schedule from "node-schedule";
import path from "node:path";
import { YtdlResult } from "./interfaces/YtdlResult";
import db from "./database.js";
import { existsSync, unlinkSync } from "node:fs";
import { exit } from "node:process";

const downloadPath = existsSync("/music") ? "/music" : path.resolve("./music");
const databasePath = existsSync("/data")
  ? "/data/database.db"
  : "data/database.db";
const favListId = process.env.FAV_LIST_ID as string;

async function downloadAudio(
  url: string,
  dstPath: string
): Promise<YtResponse> {
  const config: YtFlags = {
    extractAudio: true,
    embedThumbnail: true,
    addMetadata: true,
    output: `${dstPath}/%(title)s.%(ext)s`,
    retries: 3,
    dumpSingleJson: true,
    simulate: false,
    noPlaylist: true,
  };
  return youtubedl(url, config);
}

function bvidsInFavList(favListId: string): AsyncIterable<string> {
  const getPaginatedUrl = function (pageNum: number) {
    return `https://api.bilibili.com/x/v3/fav/resource/list?media_id=${favListId}&pn=${pageNum}&ps=20&keyword=&order=mtime&type=0&tid=0&platform=web&jsonp=jsonp`;
  };
  let pageNum = 1;
  let hasMore = true;
  return {
    async *[Symbol.asyncIterator]() {
      while (hasMore) {
        const res: FavList = await (
          await fetch(getPaginatedUrl(pageNum))
        ).json();
        yield* res.data.medias.map((media) => media.bvid);
        hasMore = res.data.has_more;
        pageNum++;
      }
    },
  };
}

function toBiliUrl(bvid: string): string {
  return `https://www.bilibili.com/video/${bvid}`;
}

let mutexLock = false;

async function runSync() {
  let hasError = false;
  if (mutexLock) {
    return;
  } else {
    mutexLock = true;
  }

  let knownBvids = await db.getAllBvids(favListId);

  let updatedBvids: string[] = [];
  for await (let bvid of bvidsInFavList(favListId)) {
    updatedBvids.push(bvid);
  }

  let bvidsToFetch = updatedBvids.filter((bvid) => !knownBvids.includes(bvid));
  let bvidsToDelete = knownBvids.filter((bvid) => !updatedBvids.includes(bvid));

  console.log(
    `[歌单同步] 新列表获取完成，需要拉取${bvidsToFetch.length}条，删除${bvidsToDelete.length}条`
  );

  for (let bvid of bvidsToFetch) {
    console.log(`[歌单同步] 正在拉取: ${bvid}`);
    await downloadAudio(toBiliUrl(bvid), downloadPath)
      // @ts-ignore: 这个库的类型标注，我真的会谢
      .then((output: string) => {
        let res: YtdlResult = JSON.parse(output.slice(output.indexOf("{")));
        let filepath =
          res.requested_downloads[0].filepath ||
          res.requested_downloads[0]._filename;
        if (filepath) {
          db.setItem(bvid, filepath, favListId);
        } else {
          throw "文件名无效，或无法解析下载进程输出";
        }
        console.log(`[歌单同步] 下载完成: ${res.title} - ${res.uploader}`);
      })
      .catch((err) => {
        console.error(`[歌单同步] 条目下载失败: ${bvid} - ${err}`);
        hasError = true;
      });
  }

  for (let bvid of bvidsToDelete) {
    console.log(`[歌单同步] 正在删除: ${bvid}`);
    let audioPath = await db.getAudioFilePathByBvid(bvid, favListId);
    if (existsSync(audioPath)) {
      unlinkSync(audioPath);
      console.log(`[歌单同步] 文件已删除: ${audioPath}`);
    } else {
      console.error(`[歌单同步] 文件未删除: 找不到文件 ${audioPath}`);
    }
  }

  mutexLock = false;
  console.log(`[歌单同步] 同步结束`);
  if (hasError) {
    console.log(`[歌单同步] 同步时出现错误, 即将在1分钟后再次同步`);
    setTimeout(runSync, 60000);
  }
}

async function run() {
  if (!favListId) {
    console.error("[环境变量] 未指定收藏夹ID");
    exit(127);
  }

  if (!existsSync("/music") || !existsSync("/data")) {
    console.warn(
      "[持久存储] 警告: 没有检测到挂载目录，请检查你的docker run命令; 数据可能不会被保存"
    );
  }
  await db.initializeDatabase(databasePath, favListId);
  schedule.scheduleJob("0 * * * *", runSync);
  console.log("[计划任务] 定时器已启动，3秒后执行初始同步...");
  setTimeout(runSync, 3000);
}

run();
