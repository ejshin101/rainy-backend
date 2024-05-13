import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {Like, Repository} from 'typeorm';
import { User } from './user.entity';
import {GetAllUsersRequestDto} from "./dto/GetAllUsersRequestDto";
import {pagingResponseDto} from "../common/dto/pagingResponse.dto";
import ResponseCodeEnum from "../common/enum/ResponseCode.enum";
import {UserResponseDto} from "./dto/UserResponseDto";
import {Plant} from "../plant/plant.entity";
import {CreateUserDto} from "./dto/CreateUserDto";
import {executeResponseDto} from "../common/dto/executeResponse.dto";
import TrueFalseCodeEnum from "../common/enum/TrueFalseCode.enum";
import UserStatusCodeEnum from "../common/enum/user/UserStatusCode.enum";
import {UpdateUserDto} from "./dto/UpdateUserDto";

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: Repository<User>,
    ) {}

    async findAll(getAllUsersRequestDto: GetAllUsersRequestDto): Promise<pagingResponseDto<UserResponseDto>> {
        const total = await this.userRepository.count({
            where: [{
                USER_NM: Like(`%${getAllUsersRequestDto.keyword}%`),
            },{
                USER_EMAIL: Like(`%${getAllUsersRequestDto.keyword}%`),
            }]
        });
        const resultData: UserResponseDto[] = await this.userRepository.find({
            take: getAllUsersRequestDto.pageSize,
            where: [{
                USER_NM: Like(`%${getAllUsersRequestDto.keyword}%`),
            },{
                USER_EMAIL: Like(`%${getAllUsersRequestDto.keyword}%`),
            }],
            skip: getAllUsersRequestDto.getOffset(),
            select: {
                USER_NM: true,
                USER_SNO: true,
                USER_EMAIL: true,
                USER_CD: true,
                USER_STAT_CD: true,
                DEL_TF: true
            }
        });

        return new pagingResponseDto(
            ResponseCodeEnum.success,
            total,
            getAllUsersRequestDto.pageNo,
            getAllUsersRequestDto.pageSize,
            resultData,
        );
    }

    async find(sno: number): Promise<UserResponseDto> {
        return await this.userRepository.findOne({
            where: { USER_SNO: sno },
            select: {
                USER_NM: true,
                USER_SNO: true,
                USER_EMAIL: true,
                USER_CD: true,
                USER_STAT_CD: true,
                DEL_TF: true
            }
        });
    }

    async create(user: CreateUserDto) : Promise<executeResponseDto> {
        const result = await this.userRepository.save({
            USER_NM: user.USER_NM,
            USER_EMAIL: user.USER_EMAIL,
            USER_PSWD: user.USER_PSWD,
            USER_CD: user.USER_CD,
            CRTE_DTT: new Date(),
            DEL_TF: TrueFalseCodeEnum.isFalse,
            USER_STAT_CD: UserStatusCodeEnum.active,
            USER_USE_TF: TrueFalseCodeEnum.isTrue
        });

        return new executeResponseDto(
            ResponseCodeEnum.success,
            result.USER_SNO ? 1 : 0
        );
    }

    async update(sno: number, user: UpdateUserDto): Promise<executeResponseDto> {
        const updateData = {
            ...user,
            EDIT_DTT: new Date()
        }
        const result = await this.userRepository.update(sno, updateData);

        return new executeResponseDto(
            ResponseCodeEnum.success,
            result.affected
        );
    }

    async delete(sno: number) : Promise<executeResponseDto> {
        const result = await this.userRepository.delete(sno);

        return new executeResponseDto(
            ResponseCodeEnum.success,
            result.affected
        )
    }
}
