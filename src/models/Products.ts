import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Shops } from "./Shop";

@Entity()
export class Products {
  @PrimaryGeneratedColumn()
  idProducts!: number;

  @Column()
  productName!: string;

  @ManyToOne(() => Shops, (shop) => shop.idshops)
  shops!: Shops;
}
