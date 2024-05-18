import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'PLNT_TYPE',
})
export class Plant extends BaseEntity {
  @PrimaryGeneratedColumn()
  plntTypeSno: number;

  @Column({ type: 'varchar', length: 50 })
  plntTypeKor: string;
}
