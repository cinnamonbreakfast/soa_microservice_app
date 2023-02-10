import { Chat, Member } from "../../models";
import { ChatDTO } from "./ChatDTO";
import { MessageDTO } from "./MessageDTO";

export class MemberDTO {
  memberId: string;
  chatPId: string;
  nickname: string;
  isAdmin: boolean;
  chat: ChatDTO;
  messages: MessageDTO[];

  static toDTO(member: Member): MemberDTO {
    return {
      memberId: member.memberId,
      chatPId: member.chatPId,
      nickname: member.nickname,
      isAdmin: member.isAdmin,
      messages: member.messages.map((message) => MessageDTO.toDTO(message)),
      chat: ChatDTO.toDTO(member.chat),
    };
  }
}
