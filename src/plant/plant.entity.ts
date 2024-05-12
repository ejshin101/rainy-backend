import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'PLNT_TYPE',
})
export class Plant extends BaseEntity {
  @PrimaryColumn({ type: 'int' })
  plntTypeSno: number;

  @Column({ type: 'varchar', length: 50 })
  plntTypeKor: string;
}
