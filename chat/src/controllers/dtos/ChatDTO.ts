import { Chat, Member, Message } from "../../models";
import { MemberDTO } from "./MemberDTO";
import { MessageDTO } from "./MessageDTO";

export class ChatDTO {
  uid: string;
  chatName: string;
  createdAt: Date;
  members: MemberDTO[];
  messages: MessageDTO[];

  static toDTO(chat: Chat): ChatDTO {
    return {
      uid: chat.uid,
      chatName: chat.chatName,
      createdAt: chat.createdAt,
      members: chat.members.map((member: Member) => MemberDTO.toDTO(member)),
      messages: chat.messages.map((message: Message) =>
        MessageDTO.toDTO(message)
      ),
    };
  }
}
