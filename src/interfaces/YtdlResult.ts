export interface YtdlResult {
  id: string;
  bv_id: string;
  title: string;
  description: string;
  duration: number;
  formats: Format[];
  http_headers: HttpHeaders2;
  cid: string;
  timestamp: number;
  thumbnail: string;
  uploader: string;
  uploader_id: string;
  subtitles: Subtitles;
  tags: string[];
  webpage_url: string;
  original_url: string;
  webpage_url_basename: string;
  webpage_url_domain: string;
  extractor: string;
  extractor_key: string;
  playlist: any;
  playlist_index: any;
  thumbnails: Thumbnail[];
  display_id: string;
  fulltitle: string;
  duration_string: string;
  upload_date: string;
  requested_subtitles: any;
  _has_drm: any;
  requested_downloads: RequestedDownload[];
  url: string;
  ext: string;
  fps: any;
  width: number;
  height: number;
  acodec: string;
  vcodec: string;
  tbr: number;
  filesize: any;
  protocol: string;
  audio_ext: string;
  video_ext: string;
  abr: number;
  format_id: string;
  format: string;
  resolution: string;
  filesize_approx: number;
  epoch: number;
  _type: string;
  _version: Version;
}

export interface Format {
  url: string;
  ext: string;
  fps: any;
  width?: number;
  height?: number;
  acodec?: string;
  vcodec?: string;
  tbr?: number;
  filesize: any;
  protocol: string;
  audio_ext: string;
  video_ext: string;
  abr?: number;
  format_id: string;
  format: string;
  resolution?: string;
  filesize_approx?: number;
  http_headers: HttpHeaders;
  quality?: number;
  dynamic_range?: string;
  vbr?: number;
}

export interface HttpHeaders {
  "User-Agent": string;
  Accept: string;
  "Accept-Language": string;
  "Sec-Fetch-Mode": string;
  Referer: string;
}

export interface HttpHeaders2 {
  "User-Agent": string;
  Accept: string;
  "Accept-Language": string;
  "Sec-Fetch-Mode": string;
  Referer: string;
}

export interface Subtitles {
  danmaku: Danmaku[];
}

export interface Danmaku {
  ext: string;
  url: string;
}

export interface Thumbnail {
  url: string;
  id: string;
  filepath: string;
}

export interface RequestedDownload {
  http_headers: HttpHeaders3;
  url: string;
  ext: string;
  width: number;
  height: number;
  acodec: string;
  vcodec: string;
  tbr: number;
  protocol: string;
  audio_ext: string;
  video_ext: string;
  abr: number;
  format_id: string;
  format: string;
  resolution: string;
  filesize_approx: number;
  epoch: number;
  _filename: string;
  __postprocessors: any[];
  __real_download: boolean;
  __finaldir: string;
  filepath: string;
  __write_download_archive: boolean;
}

export interface HttpHeaders3 {
  "User-Agent": string;
  Accept: string;
  "Accept-Language": string;
  "Sec-Fetch-Mode": string;
  Referer: string;
}

export interface Version {
  version: string;
  current_git_head: any;
  release_git_head: string;
  repository: string;
}
