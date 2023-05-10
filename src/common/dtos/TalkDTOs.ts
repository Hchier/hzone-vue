export  type PrivateChatAddDTO = {
    to: string,
    content: string,
}

export  type PrivateChatAddSuccessDTO = {
    id: number,
    from: string,
    to: string,
    content: string,
    createTime: string,
}

export type PrivateMsgRecallDTO = {
    id: number,
    sender: string,
    receiver: string,
}

export type BroadcastMsgAddDTO = {
    content: string,
}

export type BroadcastMsgAddSuccessDTO = {
    id: number,
    from: string,
    content: string,
    createTime: string,
}