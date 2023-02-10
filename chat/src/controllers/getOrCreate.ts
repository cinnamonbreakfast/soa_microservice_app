import { Request, Response } from "express";
import ChatService from "../services/ChatService";
import { ChatDTO } from "./dtos/ChatDTO";

export const getOrCreate = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { chatName } = req.query;
  const authUser = req.headers["x-auth-user-id"] as string;

  const chat = await ChatService.getOrCreate(
    authUser,
    userId,
    chatName as string
  );

  const chatDTO: ChatDTO = {
    uid: chat.uid,
    chatName: chat.chatName,
    createdAt: chat.createdAt,
    members: [],
    messages: [],
  };

  res.status(200).json(chatDTO);
};
