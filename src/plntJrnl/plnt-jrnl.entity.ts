import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'PLNT_JRNL',
})
export class PlntJrnl extends BaseEntity {
  @PrimaryColumn({ type: 'int' })
  plntJrnlSno: number;

  @Column({ type: 'int' })
  userPlntSno: number;

  @Column({ type: 'int' })
  userSno: number;

  @Column({ type: 'date' })
  plntJrnlDt: string;

  @Column({ type: 'varchar', length: 200 })
  plntJrnlTtle: string;

  @Column({ type: 'varchar', length: 1000 })
  plntJrnlCtnt: string;

  @Column({ type: 'datetime' })
  crteDtt: string;

  @Column({ type: 'datetime' })
  editDtt: string;
}
