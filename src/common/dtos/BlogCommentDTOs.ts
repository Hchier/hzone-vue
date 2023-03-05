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
    hidden: number,
    pageNum: number,
}