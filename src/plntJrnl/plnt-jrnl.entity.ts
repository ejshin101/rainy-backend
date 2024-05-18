import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'PLNT_JRNL',
})
export class PlntJrnl extends BaseEntity {
  @PrimaryGeneratedColumn()
  plntJrnlSno: number;

  @Column({ type: 'int' })
  userPlntSno: number;

  @Column({ type: 'int' })
  userSno: number;

  @Column({ type: 'date' })
  plntJrnlDt: Date;

  @Column({ type: 'varchar', length: 200 })
  plntJrnlTtle: string;

  @Column({ type: 'varchar', length: 1000 })
  plntJrnlCtnt: string;

  @Column({ type: 'datetime', default: () => 'NOW()' })
  crteDtt: Date;

  @Column({ type: 'datetime', nullable: true })
  editDtt: Date;
}
