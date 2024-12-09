import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Shops } from "./Shop";

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  idUsers!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @CreateDateColumn()
  created_at!: Date;

  @OneToOne(() => Shops, (shops) => shops.user, {
    cascade: ["remove"],
    onDelete: "CASCADE",
  })
  shop!: Shops;
}
