import { createClient } from "redis";
import type { RedisClientType } from "redis";

export default class RedisClient {
  private PORT: number;
  private HOST: string;
  private static instance: RedisClient;
  private client: RedisClientType;

  constructor() {
    this.PORT = +process.env.REDIS_PORT || 6379;
    this.HOST = process.env.REDIS_HOST || "localhost";

    RedisClient.instance = this;

    this.client = createClient({
      socket: {
        port: this.PORT,
        host: this.HOST,
      },
    });
    this.connect();
  }

  async connect() {
    await this.client.connect();
  }

  setKey = async (key: string, value: string) => {
    await this.client.set(key, value);
  };
  getKey = async (key: string) => {
    const record = await this.client.get(key);
    if (!record) {
      throw new Error("Record not found");
    }
    return record;
  };

  hset = async (key: string, fields: { field: string; value: any }[]) => {
    const fieldsParsed = fields
      .map((field) => [field.field, field.value])
      .flatMap((x) => x);
    return await this.client.hSet(key, fieldsParsed);
  };
}
