import { Repository } from "typeorm";
import RedisClient from "../config/redis";
import { Member } from "../models";
import { AppDataSource } from "../config/db";
import { toResult } from "../helpers/promise";

export class MemberService {
  private redisClient: RedisClient;
  private memberRepository: Repository<Member>;

  constructor() {
    this.redisClient = new RedisClient();
    this.memberRepository = AppDataSource.getRepository(Member);
  }

  getMember = async (memberId: string): Promise<Member> => {
    console.log("Getting member from redis", memberId);
    try {
      return JSON.parse(await this.redisClient.getKey(memberId));
    } catch (e) {
      console.log("Member not found in redis", memberId);
      const rMember = await toResult(
        this.memberRepository.findOne({
          where: {
            memberId: memberId,
          },
          select: {
            memberId: true,
            chatPId: true,
            nickname: true,
            isAdmin: true,
          },
        })
      );
      if (!rMember.isSuccessful) {
        throw rMember.error;
      }
      await this.redisClient.setKey(memberId, JSON.stringify(rMember.result));
      console.log("Saved member in redis", rMember.result);
      return rMember.result as Member;
    }
  };

  findAllInChat = async (chatId: string): Promise<Member[]> => {
    const rMembers = await toResult(
      this.memberRepository.find({
        where: {
          chatPId: chatId,
        },
        select: {
          memberId: true,
          chatPId: true,
          nickname: true,
          isAdmin: true,
        },
      })
    );
    if (!rMembers.isSuccessful) {
      throw rMembers.error;
    }
    return rMembers.result;
  };
}
