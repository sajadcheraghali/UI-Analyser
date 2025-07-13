import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from "typeorm";
import { User } from "./User";

@Entity()
export class Evaluation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.evaluations, { lazy: true })
  user!: Promise<User>;

  @Column()
  url!: string;

  @Column("text")
  feedback!: string;

  @Column("simple-json")
  scores: {
    usability: number;
    design: number;
    performance: number;
  } = {
    usability: 0,
    design: 0,
    performance: 0,
  };

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  submittedAt!: Date;

  @Column({ default: "pending" })
  status: "pending" | "approved" | "rejected" = "pending";
}