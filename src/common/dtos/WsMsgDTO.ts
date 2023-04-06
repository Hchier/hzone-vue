export  type WsMsgDTO<T> = {
    type: number,
    receiver: string,
    body: T,
}