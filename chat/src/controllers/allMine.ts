import { Request, Response } from "express";
import ChatService from "../services/ChatService";

export const allMyChats = async (req: Request, res: Response) => {
  const authUser = req.headers["x-auth-user-id"] as string;

  console.log("allMyChats", authUser);

  const chats = await ChatService.getMyChats(authUser);

  res.status(200).json(chats);
};
