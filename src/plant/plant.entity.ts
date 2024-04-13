import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'plnt_type',
})
export class Plant extends BaseEntity {
  @PrimaryGeneratedColumn()
  PLNT_TYPE_SNO: number;

  @Column({ type: 'varchar', length: 50 })
  PLNT_TYPE_KOR: string;
}
