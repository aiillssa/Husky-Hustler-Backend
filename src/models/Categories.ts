import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
import { Shops } from "./Shop";

@Entity()
export class Categories {
  @PrimaryColumn()
  idCategories!: number;

  @Column()
  categoryName!: string;

  @ManyToMany(() => Shops, (shop) => shop.categories)
  @JoinTable()
  shops!: Shops[];
}
