export type BlogCommentDeleteDTO = {
    receiver: string,
    id: number,
    blogId: number,
    baseComment: number,
    commentOf: number
}

export type BlogCommentGetDTO = {
    blogId: number,
    baseComment: number,
    pageNum: number,
}

export type BlogCommentPublishDTO = {
    receiver: string,
    blogId: number,
    content: string,
    baseComment: number,
    commentOf: number,
}