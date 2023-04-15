import {post} from "@/utils/request";

export default {
    getReadNumChart: (type: string) => post("/topic/readNumChart/" + type),
};