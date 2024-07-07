import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'EMAIL_VER',
})
export class EmailVer extends BaseEntity {
  @PrimaryGeneratedColumn()
  EMAIL_VER_SNO: number;

  @Column({ type: 'int' })
  USER_SNO: number;

  @Column({ type: 'varchar', length: 20 })
  EMAIL_VER_CD: string;

  @Column({
    type: 'datetime',
    default: () => 'NOW()',
  })
  CRTE_DTT: Date;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  EXPR_DTT: Date;
}
