
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";

// فقط برای تایپ
import type { User } from "./User";

@Entity()
export class Account {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;

  @Column()
  type!: string;

  @Column()
  provider!: string;

  @Column()
  providerAccountId!: string;

  @Column({ nullable: true })
  refresh_token?: string;

  @Column({ nullable: true })
  access_token?: string;

  @Column({ nullable: true })
  expires_at?: number;

  @Column({ nullable: true })
  token_type?: string;

  @Column({ nullable: true })
  scope?: string;

  @Column({ nullable: true, type: "text" })
  id_token?: string;

  @Column({ nullable: true })
  session_state?: string;

  @ManyToOne(
    () => require("./User").User,
    (user: User) => user.accounts,
    { onDelete: "CASCADE" }
  )
  user!: User;
}
