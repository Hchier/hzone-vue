export interface BlogCommentVO {
  id: number;
  publisher: string;
  blogId: number;
  content: string;
  commentNum: number;
  favorNum: number;
  hidden: boolean;
  deleted: boolean;
  sourceComment: number;
  commentOf: number;
  createTime: Date;
}

export interface BlogCommentForm {
  publisher: string;
  blogId: number;
  content: string;
  sourceComment: number;
  commentOf: number;
}
