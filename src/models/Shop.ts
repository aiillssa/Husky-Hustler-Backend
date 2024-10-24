// TODO: Ailsa
// Use Prisma / TypeORM to define the table schema for Shop

import { JoinColumn, JoinTable, ManyToMany, OneToOne } from "typeorm"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { Users } from "./Users"
import { Categories } from "./Categories"


@Entity()
export class Shops {
    @PrimaryGeneratedColumn()
    //note this is a non-null assertion that tells ts we will assign these values at runtime
    //Side note, if we don't want this, we can set "strict" = false in tsconfig.json but its BAD!!!
    idshops!: number
    
    @Column()
    shopName!: string

    @Column()
    shopDescription!: string

    @Column()
    ownerName!: string

    @Column()
    contactInformation!: string
    
    //returning the idUsers field
    @OneToOne(() => Users, (users) => users.idUsers)
    @JoinColumn()
    user!: Users

    @ManyToMany(()=>Categories, (category) => category.idCategories)
    @JoinTable()
    categories !: Categories[]

}
