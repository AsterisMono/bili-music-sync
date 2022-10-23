export interface FavList {
  code: number;
  message: string;
  ttl: number;
  data: Data;
}

export interface Data {
  info: Info;
  medias: Media[];
  has_more: boolean;
}

export interface Info {
  id: number;
  fid: number;
  mid: number;
  attr: number;
  title: string;
  cover: string;
  upper: Upper;
  cover_type: number;
  cnt_info: CntInfo;
  type: number;
  intro: string;
  ctime: number;
  mtime: number;
  state: number;
  fav_state: number;
  like_state: number;
  media_count: number;
}

export interface Upper {
  mid: number;
  name: string;
  face: string;
  followed: boolean;
  vip_type: number;
  vip_statue: number;
}

export interface CntInfo {
  collect: number;
  play: number;
  thumb_up: number;
  share: number;
}

export interface Media {
  id: number;
  type: number;
  title: string;
  cover: string;
  intro: string;
  page: number;
  duration: number;
  upper: Upper2;
  attr: number;
  cnt_info: CntInfo2;
  link: string;
  ctime: number;
  pubtime: number;
  fav_time: number;
  bv_id: string;
  bvid: string;
  season: any;
  ogv: any;
  ugc: Ugc;
}

export interface Upper2 {
  mid: number;
  name: string;
  face: string;
}

export interface CntInfo2 {
  collect: number;
  play: number;
  danmaku: number;
}

export interface Ugc {
  first_cid: number;
}
