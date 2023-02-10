import { DataSource, DataSourceOptions } from "typeorm";
import { createDatabase } from "typeorm-extension";
import { Chat, Member, Message } from "../models";

const options: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + "/../models/*.{js,ts}"],
  migrations: [__dirname + "/../migrations/*.{js,ts}"],
  logging: true,
  synchronize: true,
};
export const AppDataSource = new DataSource(options);

const init = async () => {
  await createDatabase({ ifNotExist: true, options });
  return AppDataSource.initialize();
};
export default init;
