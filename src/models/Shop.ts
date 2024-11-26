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
  //note this is a non-null assertion that tells ts we will assign these values at runtime
  //Side note, if we don't want this, we can set "strict" = false in tsconfig.json but its BAD!!!
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

  //returning the idUsers field
  @OneToOne(() => Users, (users) => users.shop, { onDelete: "CASCADE" })
  @JoinColumn() // This will make shop the owning side of this one-to-one relation thing
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

  @OneToMany(() => Products, (product) => product.shop)
  products!: Products[];
}
