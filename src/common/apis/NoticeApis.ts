import {post} from "@/utils/request";

export default {
    get: (pageNum: number) => post("/notice/get/" + pageNum),
    delete: (id: number) => post("/notice/delete/" + id),
    sendAuthCode: (email: string) => post("/notice/sendAuthCode?email=" + email),
};
