// src/modules/visits/principalInteraction.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { Interaction } from "./interaction.entity";
import { Lead } from "../leads/lead.entity";

export type LinkedInteractionRef = {
  visId?: string; // front-end visit summary id if applicable (UI)
  visitId?: number; // DB visit id
  interactionId?: number; // DB interaction id
  piId?: number | string; // DB pi id (or uid used by UI)
  company?: string;
  date?: string; // dd-mm-yyyy or ISO
  person?: string;
  notes?: string;
  product?: string;
};

@Entity({ name: "principal_interactions" })
@Index(["principalName"])
export class PrincipalInteraction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  interactionId!: number;

  @Column({ unique: true })
  piCode!: string; // e.g. V0001-I001-PI001

  @ManyToOne(() => Interaction, (i) => i.principalInteractions)
  interaction!: Interaction;

  @Column({ nullable: true })
  principalName?: string; // primary actor (Deublin, Koba, etc)

  // keep product optional for compatibility (leads will still contain product)
  @Column({ nullable: true })
  product?: string;

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

  @OneToOne(() => Lead, (l) => l.principalInteraction)
  @JoinColumn({ name: "leadId" })
  lead?: Lead;

  /**
   * linkedInteractions now stores structured objects (JSONB)
   * Example item:
   * { visitId: 12, interactionId: 34, piId: 56, company: "Tata Steel", date: "02-12-2025", person: "Mr. Kumar", notes: "Discussed sealing" }
   */
  @Column("jsonb", { nullable: true })
  linkedInteractions?: LinkedInteractionRef[];

  @CreateDateColumn()
  createdAt!: Date;
}
