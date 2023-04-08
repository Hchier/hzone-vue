import {post, postWithoutJson} from "@/utils/request";
import {PrivateChatAddDTO, PrivateMsgRecallDTO} from "@/common/dtos/TalkDTOs";

export default {
    getChatUserVOList: () => post("/talk/getChatUserVOList"),
    getPrivateMsgsWith: (to: string, pageSize: number) => post("/talk/getPrivateMsgsWith/" + to + "/" + pageSize),
    recall: (dto: PrivateMsgRecallDTO) => postWithoutJson("/talk/recall", dto),
    sendMsg: (dto: PrivateChatAddDTO) => postWithoutJson("/talk/privateTalk", dto),
};