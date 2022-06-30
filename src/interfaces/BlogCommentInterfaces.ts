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

export interface BlogCommentAddForm {
  publisher: string;
  blogId: number;
  content: string;
  sourceComment: number;
  commentOf: number;
}

export interface BlogCommentDeleteForm {
  id: number;
  blogId: number;
}
