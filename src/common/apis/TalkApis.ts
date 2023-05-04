import {post, postWithoutJson} from "@/utils/request";
import {PrivateChatAddDTO, PrivateMsgRecallDTO} from "@/common/dtos/TalkDTOs";

export default {
    getChatUserVOList: () => post("/talk/getChatUserVOList"),
    getPrivateMsgsWith: (to: string, pageNum: number) => post("/talk/getPrivateMsgsWith/" + to + "/" + pageNum),
    recall: (dto: PrivateMsgRecallDTO) => postWithoutJson("/talk/privateMsgRecall", dto),
    sendMsg: (dto: PrivateChatAddDTO) => postWithoutJson("/talk/privateTalk", dto),
    getBroadcastMsgs: (pageNum: number) => post("/talk/getBroadcastMsgs/" + pageNum),
};