import {
  BaseEntity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./Users";
import { Categories } from "./Categories";
import { Products } from "./Products";

@Entity()
export class Shops extends BaseEntity {
  @PrimaryGeneratedColumn()
  idshops!: number;

  @Column()
  shopName!: string;

  @Column()
  shopDescription!: string;

  @Column("simple-json", { nullable: true })
  necessaryDescription!: Record<any, any>;

  @Column()
  ownerName!: string;

  @Column("simple-json")
  contactInformation!: Record<string, any>;

  @OneToOne(() => Users, (users) => users.shop, { onDelete: "CASCADE" })
  @JoinColumn()
  user!: Users;

  @ManyToMany(() => Categories)
  @JoinTable({
    joinColumn: { name: "shop", referencedColumnName: "idshops" },
    inverseJoinColumn: {
      name: "categories",
      referencedColumnName: "categoryName",
    },
  })
  categories!: Categories[];

  @OneToMany(() => Products, (product) => product.shop, {
    onDelete: "CASCADE",
    cascade: ["insert", "update", "remove"],
    nullable: true,
  })
  products!: Products[];
}
