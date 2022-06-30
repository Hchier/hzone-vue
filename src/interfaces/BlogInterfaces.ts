export interface BlogVO {
  id: number;
  publisher: string;
  title: string;
  content: string;
  favorNum: number;
  commentNum: number;
  clickNum: number;
  selfVisible: boolean;
  hidden: boolean;
  updateTime: Date;
  favored: boolean;
  tagList: Array<string>;
}

export interface BlogFavorForm {
  praiser: string;
  blogId: number;
}
