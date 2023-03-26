export type BlogCommentVO = {
    id: number,
    publisher: string,
    receiver: string,
    blogId: number,
    content: string,
    commentNum: number,
    favorNum: number, //砍了

    hidden: boolean,
    baseComment: number,
    commentOf: number,
    currentUser: string
    createTime: string,
    deletePermission: boolean
};

