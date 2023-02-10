import { Request, Response } from "express";
import ChatService from "../services/ChatService";
import { MessageDTO } from "./dtos/MessageDTO";

export const sendMessage = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  console.log(req.headers);
  const message: MessageDTO = req.body;

  const chat = await ChatService.sendMessage(chatId, message);

  res.status(200).json(message);
};
