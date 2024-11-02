import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
} from "typeorm";
import { Shops } from "./Shop";

@Entity()
export class Categories extends BaseEntity {
  @PrimaryColumn({ unique: true })
  categoryName!: string;

  @ManyToMany(() => Shops)
  shops!: Shops[];
}
