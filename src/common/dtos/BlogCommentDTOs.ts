export type BlogCommentDeleteDTO = {
    receiver: string,
    id: number,
    blogId: number,
    baseComment: number,
    commentOf: number
}