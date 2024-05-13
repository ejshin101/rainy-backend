import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'USER_PLNT',
})
export class UserPlnt extends BaseEntity {
  @PrimaryColumn({ type: 'int' })
  userPlntSno: number;

  @Column({ type: 'varchar', length: 50 })
  userPlntNm: string;

  @Column({ type: 'int' })
  plntTypeSno: number;

  @Column({ type: 'date' })
  plntAdptDt: string;

  @Column({ type: 'int' })
  plntAdptPrice: number;

  @Column({ type: 'varchar', length: 50 })
  plntAdptLctnNm: string;

  @Column({ type: 'varchar', length: 1000 })
  plntDesc: string;

  @Column({ type: 'datetime' })
  crteDtt: string;

  @Column({ type: 'datetime' })
  editDtt: string;

  @Column({ type: 'int' })
  userSno: number;
}
