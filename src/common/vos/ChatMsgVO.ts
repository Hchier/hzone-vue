export type ChatMsgVO = {
    id: number,
    from: string,
    to: string,
    content: string,
    createTime: string,
    fromCurrentUser: boolean,
}