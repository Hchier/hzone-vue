export type BlogUpdateDTO = {
    id: number,
    title: string,
    content: string,
    selfVisible: boolean,
    commentForbidden: boolean,
}

export type BlogPublishDTO = {
    title: string,
    content: string,
    topic: string,
}