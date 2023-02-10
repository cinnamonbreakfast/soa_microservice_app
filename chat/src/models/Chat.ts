import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Message } from "./Message";
import { Member } from "./Member";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @Column()
  chatName: string;

  @Column()
  createdAt: Date;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @OneToMany(() => Member, (member) => member.chat)
  members: Member[];
}
