import { Request, Response } from "express";
import ChatService from "../services/ChatService";

export const findChat = async (req: Request, res: Response) => {
  const { uid1, uid2 } = req.query;

  const chat = await ChatService.chatExists(uid1 as string, uid2 as string);

  res.status(200).json(chat);
};
