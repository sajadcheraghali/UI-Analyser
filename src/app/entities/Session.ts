
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";

// فقط تایپ
import type { User } from "./User";

@Entity()
export class Session {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  sessionToken!: string;

  @Column()
  userId!: string;

  @Column()
  expires!: Date;
  

  @ManyToOne(
    // Lazy import function برای جلوگیری از circular dependency
    () => require("./User").User,
    (user: User) => user.sessions,
    {
      onDelete: "CASCADE",
    }
  )
  user!: User;
}
