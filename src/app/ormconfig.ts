import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Session } from "./entities/Session";
import { Account } from "./entities/Account";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [User, Session, Account],
  migrations: ["src/migrations/*.ts"],
});

