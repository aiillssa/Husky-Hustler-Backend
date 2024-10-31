// TODO: Ailsa
// Use Prisma / TypeORM to define the table schema for User

import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Shops } from "./Shop";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  //note this is a non-null assertion that tells ts we will assign these values at runtime
  //Side note, if we don't want this, we can set "strict" = false in tsconfig.json but its BAD!!!
  idUsers!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;
  //links the user to their shop and creates a column for it
  @OneToOne(() => Shops, (shops) => shops.user)
  @JoinColumn()
  shop!: Shops;
}
