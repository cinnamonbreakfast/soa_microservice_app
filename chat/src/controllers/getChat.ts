import { Request, Response } from "express";
import ChatService from "../services/ChatService";

export const getChat = async (req: Request, res: Response) => {
  const { chatId } = req.params;

  const chat = await ChatService.getChat(chatId);

  res.status(200).json(chat);
};
