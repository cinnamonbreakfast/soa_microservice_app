import { Repository } from "typeorm";
import { AppDataSource } from "../config/db";
import RedisClient from "../config/redis";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";
import { Member } from "../models/Member";
import { toResult } from "../helpers/promise";
import { v4 } from "uuid";
import { MessageDTO } from "../controllers/dtos/MessageDTO";
import { MemberService } from "./MemberService";

export class ChatService {
  private redisClient: RedisClient;
  private chatRepository: Repository<Chat>;
  private messageRepository: Repository<Message>;
  private memberRepository: Repository<Member>;
  public static instance: ChatService;
  private memberService: MemberService;

  constructor() {
    this.redisClient = new RedisClient();
    this.chatRepository = AppDataSource.getRepository(Chat);
    this.messageRepository = AppDataSource.getRepository(Message);
    this.memberRepository = AppDataSource.getRepository(Member);
    this.memberService = new MemberService();
    ChatService.instance = this;
  }

  chatExists = async (userId1: string, userId2: string): Promise<Chat> => {
    const rExistingChat = await toResult(
      AppDataSource.getRepository(Chat)
        .createQueryBuilder("chat")
        .innerJoinAndSelect("chat.members", "member")
        .where("member.memberId = :userId1", { userId1 })
        .select()
        .where("member.memberId = :userId2", { userId2 })
        .getOne()
    );

    if (!rExistingChat.isSuccessful) {
      throw rExistingChat.error;
    }

    return rExistingChat.result as Chat;
  };

  getMyChats = async (userId1: string): Promise<Chat[]> => {
    console.log("Find all chats for user", userId1);
    const rExistingChat = await toResult(
      AppDataSource.getRepository(Chat)
        .createQueryBuilder("chat")
        .innerJoinAndSelect("chat.members", "member")
        .where("member.memberId = :userId1", { userId1 })
        .getMany()
    );

    if (!rExistingChat.isSuccessful) {
      throw rExistingChat.error;
    }

    return rExistingChat.result as Chat[];
  };

  getOrCreate = async (
    userId1: string,
    userId2: string,
    title: string
  ): Promise<Chat> => {
    console.log("getOrCreate", userId1, userId2, title);

    const existingChat = await this.chatExists(userId1, userId2);
    if (existingChat) {
      return existingChat;
    }

    const newChat: Chat = new Chat();
    newChat.uid = v4();
    newChat.chatName = title || "New chat";
    newChat.createdAt = new Date();
    newChat.members = [];

    const member1: Member = new Member();
    member1.memberId = userId1;
    member1.chat = newChat;
    member1.chatPId = newChat.uid;
    member1.nickname = "";
    member1.isAdmin = true;
    newChat.members.push(member1);

    const member2: Member = new Member();
    member2.memberId = userId2;
    member2.chat = newChat;
    member2.chatPId = newChat.uid;
    member2.nickname = "";
    member2.isAdmin = true;
    newChat.members.push(member2);

    const rNewChat = await toResult(this.chatRepository.save(newChat));
    if (!rNewChat.isSuccessful) {
      throw rNewChat.error;
    }

    this.memberRepository.save(member1);
    this.memberRepository.save(member2);

    return rNewChat.result;
  };

  getChat = async (chatId: string): Promise<Chat> => {
    console.log("Getting chat from redis or db", chatId);
    try {
      const chat = JSON.parse(await this.redisClient.getKey(chatId));
      console.log("Chat found in redis", chat);
      return chat;
    } catch (e) {
      console.log("Chat not found in redis, getting from DB", e);
      const rChat = await toResult(
        AppDataSource.getRepository(Chat).findOne({
          where: {
            uid: chatId,
          },
          select: {
            uid: true,
            chatName: true,
            createdAt: true,
            members: true,
          },
        })
      );
      if (!rChat.isSuccessful) {
        console.error("Error getting chat via DB ", rChat.error);
        throw rChat.error;
      }
      await this.redisClient.setKey(chatId, JSON.stringify(rChat.result));
      console.log("Saved chat in redis ", rChat.result);
      return rChat.result;
    }
  };

  sendMessage = async (chatId: string, message: MessageDTO): Promise<Chat> => {
    const chat = await this.getChat(chatId);
    if (chat) {
      const newMessage: Message = new Message();
      console.log("message", message);
      newMessage.uid = v4();
      newMessage.chat = chat;
      newMessage.message = message.message;
      newMessage.sentAt = new Date();
      newMessage.hasAttachment = message.hasAttachment;
      newMessage.member = await this.memberService.getMember(message.memberId);
      chat.messages = [...(chat.messages || []), newMessage];

      const rMessage = await toResult(this.messageRepository.save(newMessage));
      const rChat = await toResult(this.chatRepository.save(chat));

      if (rChat.isSuccessful && rMessage.isSuccessful) {
        return chat;
      } else {
        console.group("Error sending message");
        console.log("rMessage", rMessage);
        console.log("rChat", rChat);
        console.groupEnd();
      }
    } else {
      console.error("Chat not found", chatId);
    }
  };
}

export default new ChatService();
