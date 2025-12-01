import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
} from "typeorm";
import { ProductInteraction } from "../visits/productInteraction.entity";

@Entity({ name: "leads" })
export class Lead {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  leadCode!: string; // e.g. L0001

  @OneToOne(() => ProductInteraction, (pi) => pi.lead)
  productInteraction?: ProductInteraction;

  @Column({ nullable: true })
  visitId?: number;

  @Column({ nullable: true })
  principal?: string;

  @Column({ nullable: true })
  initialQuery?: string;

  @Column({ nullable: true })
  type?: string;

  @Column({ nullable: true })
  product?: string;

  @Column({ type: "int", nullable: true })
  quantity?: number;

  @Column({ nullable: true })
  sbu?: string;

  @Column({ nullable: true })
  company?: string;

  @Column({ nullable: true })
  partner?: string;

  @Column("text", { array: true, nullable: true })
  concernedPerson?: string[];

  @Column({ nullable: true })
  mobile?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  industry?: string;

  @Column({ nullable: true })
  internalCompany?: string;

  @Column("text", { array: true, nullable: true })
  assignedTo?: string[];

  @Column({ type: "decimal", nullable: true })
  estimatedRevenue?: number;

  @Column({ nullable: true })
  currentInstallationCompetitor?: string;

  @Column({ nullable: true })
  leadSource?: string;

  @Column({ type: "decimal", nullable: true })
  probability?: number;

  @Column({ nullable: true })
  leadType?: string;

  @Column({ nullable: true })
  leadStatus?: string;

  @Column("text", { nullable: true })
  comments?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
