import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Shops } from "./Shop";

@Entity()
export class Products extends BaseEntity {
  @PrimaryGeneratedColumn()
  idProducts!: number;

  @Column()
  productName!: string;

  @ManyToOne(() => Shops, (shop) => shop.products)
  @JoinColumn({ name: "idshops" })
  shop!: Shops;
}
