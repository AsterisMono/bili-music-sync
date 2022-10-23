# bili-music-sync

 ![Docker Image Version (latest by date)](https://img.shields.io/docker/v/asterismono/bili-music-sync?sort=date) ![Docker Image Size (latest semver)](https://img.shields.io/docker/image-size/asterismono/bili-music-sync?sort=semver)

将Bilibili收藏夹中的音乐同步到本地。

## 快速开始

启动一个后台进程，将指定的收藏夹同步到本地路径。

```bash
docker run -d --read-only -v 音乐保存路径:/music -v 数据库保存路径:/data -e FAV_LIST_ID=收藏夹ID asterismono/bili-music-sync:latest
```

## 推荐用法

- 作为个人歌单的备份，防止视频被删导致无法收听
- 和[Syncthing](https://syncthing.net/)联用，将音乐从服务器同步到移动设备
