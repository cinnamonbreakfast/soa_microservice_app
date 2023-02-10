import { Server as HttpServer } from "http";
import { Socket, Server } from "socket.io";
import { AuthService } from "../helpers/auth";
import { MessageDTO } from "../controllers/dtos/MessageDTO";
import { ChatService } from "../services/ChatService";
import { MemberService } from "../services/MemberService";
import { Member } from "../models";

interface HandshakeRequest {
  token: string;
}

interface UserData {
  id: string;
  email: string;
  admin: boolean;
}

export class ServerSocket {
  public static instance: ServerSocket;
  public io: Server;
  private authService: AuthService;
  private chatService: ChatService;
  private memberService: MemberService;

  public users: {
    [uid: string]: {
      socketId: string;
      email: string;
      admin: boolean;
    };
  };

  public tokens: {
    [token: string]: Date;
  };

  constructor(sever: HttpServer) {
    ServerSocket.instance = this;
    this.users = {};
    this.tokens = {};
    this.authService = new AuthService();
    this.chatService = new ChatService();
    this.memberService = new MemberService();

    this.io = new Server(sever, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin: "*",
      },
    });

    this.io.on("connection", this.startListeners);
  }

  getToken = (socket: Socket) => socket.handshake.headers.token as string;

  startListeners = (socket: Socket) => {
    console.info(`Message: New client connected: ${socket.id}`);

    const token = this.getToken(socket);

    this.authService
      .validateToken(token)
      .then((response: UserData) => {
        this.users[response.id] = {
          socketId: socket.id,
          email: response.email,
          admin: response.admin,
        };
        this.tokens[token] = new Date();

        this.sendMessage("handshake", [socket.id], { result: "CONNECTED" });
      })
      .catch((error) => {
        // console.error(error);
        console.error("Message: Invalid token: " + token);
        socket.disconnect();
      });

    socket.on("disconnect", (e) => {
      console.info(`Message: Client disconnected: ${socket.id}, ${e}`);
      delete this.users[socket.id];
      // delete this.tokens[
      //   (socket.handshake.headers.Authorization as string).split(" ")[1]
      // ];
    });

    socket.on("message", async (messageDTO: MessageDTO) => {
      const chatResponse = await this.chatService.sendMessage(
        messageDTO.chat.uid,
        messageDTO
      );

      const chat = await this.chatService.getChat(messageDTO.chat.uid);
      const members = await this.memberService.findAllInChat(
        messageDTO.chat.uid
      );
      const users = members
        .filter((member: Member) => member.memberId !== messageDTO.memberId)
        .map((member: Member) => this.users[member.memberId].socketId);

      this.sendMessage("message_users", users, {
        ...messageDTO,
        chat: {
          ...chatResponse,
          members: undefined,
          messages: undefined,
        },
      });
    });
  };

  sendMessage = (name: string, users: string[], payload?: Object) => {
    console.info("Emitting event: " + name + " to", users);
    users.forEach((id) =>
      payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name)
    );
  };
}
