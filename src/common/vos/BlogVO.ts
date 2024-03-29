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
    updateTime: string,
    topic: string,
    updatePermission: boolean,
}