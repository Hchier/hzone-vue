import {post, postWithoutJson} from "@/utils/request";
import {PrivateChatAddDTO} from "@/common/dtos/TalkDTOs";

export default {
    getChatUserVOList: () => post("/talk/getChatUserVOList"),
    getPrivateMsgsWith: (to: string, pageSize: number) => post("/talk/getPrivateMsgsWith/" + to + "/" + pageSize),
    recall: (id: number) => post("/talk/recall/" + id),
    sendMsg: (dto: PrivateChatAddDTO) => postWithoutJson("/talk/privateTalk", dto),
};