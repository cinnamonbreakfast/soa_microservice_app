import axios from "axios";

export class AuthService {
  baseURI: string;

  constructor() {
    this.baseURI = `http://${process.env.AUTH_HOST}:${process.env.AUTH_PORT}`;
  }

  validateToken = async (token: string) => {
    console.log(this.baseURI, token);
    const response = await axios({
      method: "POST",
      url: this.baseURI + "/validateToken",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
}
