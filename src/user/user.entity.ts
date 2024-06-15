import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import TrueFalseCodeEnum from "../common/enum/TrueFalseCode.enum";
import UserCodeEnum from "../common/enum/user/UserCode.enum";
import UserStatusCodeEnum from "../common/enum/user/UserStatusCode.enum";

@Entity({
    name: 'USER',
})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    USER_SNO: number;

    @Column({ type: 'varchar', length: 50 })
    USER_NM: string;

    @Column({ type: 'varchar', length: 50 })
    USER_EMAIL: string;

    @Column({ type: 'varchar', length: 100 })
    USER_PSWD: string;

    @Column({ type: 'enum', enum: [TrueFalseCodeEnum.isFalse, TrueFalseCodeEnum.isTrue] })
    USER_USE_TF: TrueFalseCodeEnum;

    @Column({ type: 'enum', enum: [UserCodeEnum.user, UserCodeEnum.admin] })
    USER_CD: UserCodeEnum;

    @Column({ type: 'enum', enum: [UserStatusCodeEnum.active, UserStatusCodeEnum.suspended, UserStatusCodeEnum.leaving] })
    USER_STAT_CD: UserStatusCodeEnum;

    @Column({
        type: 'datetime',
        default: () => 'NOW()',
    })
    CRTE_DTT: Date;

    @Column({
        type: 'datetime',
        nullable: true,
    })
    EDIT_DTT: Date;

    @Column({ type: 'enum', enum: [TrueFalseCodeEnum.isFalse, TrueFalseCodeEnum.isTrue] })
    DEL_TF: TrueFalseCodeEnum;

}
