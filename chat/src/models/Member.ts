import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Chat } from "./Chat";
import { Message } from "./Message";

@Entity()
export class Member {
  @PrimaryGeneratedColumn("uuid")
  memberId: string;

  @PrimaryColumn()
  chatPId: string;

  @Column()
  nickname: string;

  @Column()
  isAdmin: boolean;

  @ManyToOne(() => Chat, (chat) => chat.members)
  chat: Chat;

  @OneToMany(() => Message, (message: Message) => message.member)
  messages: Message[];
}
