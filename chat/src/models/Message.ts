import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Chat } from "./Chat";
import { Member } from "./Member";

@Entity()
export class Message {
  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @Column()
  message: string;

  @Column()
  sentAt: Date;

  @Column()
  hasAttachment: boolean;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @ManyToOne(() => Member, (member: Member) => member.messages)
  member: Member;
}
