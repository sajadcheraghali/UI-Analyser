// // src/app/entities/User.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Account } from "./Account";
import { Session } from "./Session";
import { Evaluation } from "./Evaluation";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  email!: string;

  @Column({ type: "text", nullable: true })
  password!: string | null;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: "varchar", default: "user" })
  role: "user" | "admin" = "user";

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: "text", nullable: true })
  resetToken?: string;

  @Column({ type: "text", nullable: true })
  resetTokenExp?: string | null;

  @OneToMany(() => Account, (account) => account.user)
  accounts!: Account[];

  @OneToMany(() => Session, (session) => session.user)
  sessions!: Session[];

  @OneToMany(() => Evaluation, (evaluation) => evaluation.user, { lazy: true })
  evaluations!: Promise<Evaluation[]>;

  @CreateDateColumn()
  createdAt!: Date;
}