import { Message } from "../../models";
import { ChatDTO } from "./ChatDTO";
import { MemberDTO } from "./MemberDTO";

export class MessageDTO {
  uid?: string;
  message: string;
  sentAt: Date;
  hasAttachment: boolean;
  memberId: string;
  chat?: ChatDTO;

  static toDTO(message: Message): MessageDTO {
    return {
      uid: message.uid,
      message: message.message,
      sentAt: message.sentAt,
      hasAttachment: message.hasAttachment,
      memberId: message.member.memberId,
      chat: ChatDTO.toDTO(message.chat),
    };
  }
}
