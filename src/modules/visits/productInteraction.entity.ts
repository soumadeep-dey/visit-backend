import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Interaction } from "./interaction.entity";
import { Lead } from "../leads/lead.entity";

@Entity({ name: "product_interactions" })
export class ProductInteraction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  interactionId!: number;

  @Column({ unique: true })
  piCode!: string; // e.g. V0001-I001-PI001

  @ManyToOne(() => Interaction, (i) => i.productInteractions)
  interaction!: Interaction;

  @Column({ nullable: true })
  productName?: string;

  @Column("text", { nullable: true })
  objective?: string;

  @Column("text", { nullable: true })
  discussion?: string;

  @Column("text", { nullable: true })
  nextStep?: string;

  @Column({ nullable: true })
  followUpDate?: string;

  @Column({ nullable: true })
  leadId?: number;

  @OneToOne(() => Lead, (l) => l.productInteraction)
  @JoinColumn({ name: "leadId" })
  lead?: Lead;

  @Column("text", { array: true, nullable: true })
  linkedInteractions?: string[];

  @CreateDateColumn()
  createdAt!: Date;
}
