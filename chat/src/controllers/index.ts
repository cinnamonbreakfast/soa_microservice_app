import { Router } from "express";
import { findChat } from "./findChat";
import { getChat } from "./getChat";
import { addOne } from "./addOne";
import { sendMessage } from "./sendMessage";
import { getOrCreate } from "./getOrCreate";
import { allMyChats } from "./allMine";

export const chatRouter = Router({ mergeParams: true })
  .get("/find", findChat)
  .get("/mine", allMyChats)
  .get("/:chatId", getChat)
  .post("/new/:chatId", addOne)
  .post("/:chatId", sendMessage)
  .get("/open/:userId", getOrCreate);
