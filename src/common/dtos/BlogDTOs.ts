export type BlogUpdateDTO = {
    id: number,
    title: string,
    content: string,
    selfVisible: boolean,
    commentForbidden: boolean,
}