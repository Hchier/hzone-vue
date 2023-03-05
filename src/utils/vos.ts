export type RestResponse = {
    code: number,
    message: string,
    body: unknown,
}

export type BlogVO = {
    id: number,
    publisher: string,
    title: string,
    content: string,
    favorNum: number,
    commentNum: number,
    rewardNum: number,
    favored: boolean,
    selfVisible: boolean,
    hidden: boolean,
    commentForbidden: boolean,
    updateTime: Date,
    topic: string,
    updatePermission: boolean,
}

export type BlogCommentVO = {
    id: number,
    publisher: string,
    receiver: string,
    blogId: number,
    content: string,
    commentNum: number,
    favorNum: number, //砍了
    currentUser: string
    createTime: Date,
    deletePermission: boolean
};

