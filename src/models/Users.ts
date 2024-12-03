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
  //note this is a non-null assertion that tells ts we will assign these values at runtime
  //Side note, if we don't want this, we can set "strict" = false in tsconfig.json but its BAD!!!
  idUsers!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @CreateDateColumn()
  created_at!: Date;
  //links the user to their shop and creates a column for it
  @OneToOne(() => Shops, (shops) => shops.user, {
    cascade: ["remove"],
    onDelete: "CASCADE",
  })
  shop!: Shops;
}
