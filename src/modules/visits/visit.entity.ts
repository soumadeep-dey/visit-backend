import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Interaction } from "./interaction.entity";

@Entity({ name: "visits" })
export class Visit {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  visitCode!: string; // e.g. V0001

  @Column({ nullable: true })
  customerName?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  interactionType?: string;

  @Column("text", { array: true, nullable: true })
  sharedWith?: string[];

  @Column({ default: "draft" })
  status!: "draft" | "submitted";

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Interaction, (i) => i.visit, { cascade: true })
  interactions?: Interaction[];
}
