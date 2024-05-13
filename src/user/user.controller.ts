import {Body, Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import { User } from './user.entity'
import { UserService } from "./user.service";
import { GetAllUsersRequestDto } from "./dto/GetAllUsersRequestDto";
import {pagingResponseDto} from "../common/dto/pagingResponse.dto";
import {UserResponseDto} from "./dto/UserResponseDto";
import {Plant} from "../plant/plant.entity";
import {CreatePlantDto} from "../plant/create-plant.dto";
import {executeResponseDto} from "../common/dto/executeResponse.dto";
import {CreateUserDto} from "./dto/CreateUserDto";
import {UpdatePlantDto} from "../plant/update-plant.dto";
import {UpdateUserDto} from "./dto/UpdateUserDto";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get()
    findAll(
        @Query() getAllUsersRequestDto: GetAllUsersRequestDto
    ): Promise<pagingResponseDto<UserResponseDto>> {
        return this.userService.findAll(getAllUsersRequestDto);
    }

    @Get('/:sno')
    findBySno(@Param('sno') sno: number): Promise<UserResponseDto> {
        return this.userService.find(sno);
    }

    @Post()
    createPlant(@Body() user: CreateUserDto): Promise<executeResponseDto> {
        return this.userService.create(user);
    }

    @Put('/:sno')
    updatePlant(
        @Param('sno') sno: number,
        @Body() user: UpdateUserDto,
    ): Promise<executeResponseDto> {
        return this.userService.update(sno, user);
    }

    @Delete('/:sno')
    delete(@Param('sno') sno: number): Promise<executeResponseDto> {
        return this.userService.delete(sno);
    }
}
