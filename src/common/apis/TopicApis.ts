import {post} from "@/utils/request";

export default {
    getReadNumChart: (type: string) => post("/topic/readNumChart/" + type),
    getVO: (name: string) => post("/topic/get/" + name),
};