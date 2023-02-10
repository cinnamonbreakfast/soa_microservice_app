import * as http from "http";
import * as express from "express";
import { Request, Response, NextFunction } from "express";
import { ServerSocket } from "./server";
import * as path from "path";
import * as cors from "cors";
import { chatRouter } from "../controllers";
import bodyParser = require("body-parser");

const allowedOrigins = ["*"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

const app = express();

const HttpServer = http.createServer(app);

new ServerSocket(HttpServer);

app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  console.info(
    `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );

  res.on("finish", () => {
    console.info(
      `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
    );
  });

  next();
});

app.use("/apis", chatRouter);

app.use(cors(options));

app.get("/ping", (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ hello: "world!" });
});

app.get("/status", (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ users: ServerSocket.instance.users });
});

app.get("/client", (req: Request, res: Response) => {
  return res.sendFile(path.resolve("./static/index.html"));
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Not found");

  res.status(404).json({
    message: error.message,
  });
});

HttpServer.listen(process.env.PORT || 8070, () =>
  console.info(`Server is running`)
);
