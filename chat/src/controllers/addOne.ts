import { Request, Response } from "express";
import ChatService from "../services/ChatService";

export const addOne = async (req: Request, res: Response) => {
  const { chatId } = req.params;

  // const chat = await ChatService.sendMessage("chatId", "message");

  res.status(200).json(null);
};
