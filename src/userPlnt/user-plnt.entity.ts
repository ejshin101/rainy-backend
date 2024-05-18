import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'USER_PLNT',
})
export class UserPlnt extends BaseEntity {
  @PrimaryGeneratedColumn()
  userPlntSno: number;

  @Column({ type: 'varchar', length: 50 })
  userPlntNm: string;

  @Column({ type: 'int' })
  plntTypeSno: number;

  @Column({ type: 'date' })
  plntAdptDt: Date;

  @Column({ type: 'int' })
  plntAdptPrice: number;

  @Column({ type: 'varchar', length: 50 })
  plntAdptLctnNm: string;

  @Column({ type: 'varchar', length: 1000 })
  plntDesc: string;

  @Column({ type: 'datetime', default: () => 'NOW()' })
  crteDtt: Date;

  @Column({ type: 'datetime', nullable: true })
  editDtt: Date;

  @Column({ type: 'int' })
  userSno: number;
}
