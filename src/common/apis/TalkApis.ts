import {post, postWithoutJson} from "@/utils/request";
import {BroadcastMsgAddDTO, PrivateChatAddDTO, PrivateMsgRecallDTO} from "@/common/dtos/TalkDTOs";

export default {
    getChatUserVOList: () => post("/talk/getChatUserVOList"),
    getPrivateMsgsWith: (to: string, pageNum: number) => post("/talk/getPrivateMsgsWith/" + to + "/" + pageNum),
    sendPrivateMsg: (dto: PrivateChatAddDTO) => postWithoutJson("/talk/privateTalk", dto),
    recallPrivateMsg: (dto: PrivateMsgRecallDTO) => postWithoutJson("/talk/privateMsgRecall", dto),
    getBroadcastMsgs: (pageNum: number) => post("/talk/getBroadcastMsgs/" + pageNum),
    sendBroadcastMsg: (content: string) => postWithoutJson("/talk/broadcastTalk", {content: content}),
    recallBroadcastMsg: (id: number) => post("/talk/broadcastMsgRecall/" + id),
};