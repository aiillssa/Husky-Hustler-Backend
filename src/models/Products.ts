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
  caption!: string;

  @Column()
  price!: string;

  @ManyToOne(() => Shops, (shop) => shop.products, { onDelete: "CASCADE" })
  @JoinColumn({ name: "idshops" })
  shop!: Shops;
}
