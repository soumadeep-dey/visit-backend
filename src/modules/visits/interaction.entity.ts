import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Visit } from "./visit.entity";
import { PrincipalInteraction } from "./principalInteraction.entity";

@Entity({ name: "interactions" })
export class Interaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  visitId!: number;

  @Column({ unique: true })
  interactionCode!: string; // e.g. V0001-I001

  @ManyToOne(() => Visit, (v) => v.interactions)
  visit!: Visit;

  @Column("text", { array: true, nullable: true })
  departments?: string[];

  @Column("text", { array: true, nullable: true })
  personsMet?: string[];

  @Column("text", { array: true, nullable: true })
  principals?: string[];

  @OneToMany(() => PrincipalInteraction, (p) => p.interaction, {
    cascade: true,
  })
  principalInteractions?: PrincipalInteraction[];

  @CreateDateColumn()
  createdAt!: Date;
}
