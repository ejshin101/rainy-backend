import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PlntJrnlService } from './plnt-jrnl.service';
import { PlntJrnlResponseDto } from './dto/plnt-jrnl-response.dto';
import { pagingResponseDto } from '../common/dto/pagingResponse.dto';
import { PlntJrnl } from './plnt-jrnl.entity';
import { CreatePlntJrnlDto } from './dto/create-plnt-jrnl.dto';
import { executeResponseDto } from '../common/dto/executeResponse.dto';
import { UpdatePlntJrnlDto } from './dto/update-plnt-jrnl.dto';

@Controller('user')
export class PlntJrnlController {
  constructor(private readonly plntJrnlService: PlntJrnlService) {}

  @Get('/:userSno/journals')
  findAll(
    @Param('userSno') userSno: number,
    @Query() plntJrnlResponseDto: PlntJrnlResponseDto,
  ): Promise<pagingResponseDto<PlntJrnl>> {
    return this.plntJrnlService.findAll(userSno, plntJrnlResponseDto);
  }

  @Get('/:userSno/journals/:plntJrnlSno')
  findById(
    @Param('userSno') userSno: number,
    @Param('plntJrnlSno') plntJrnlSno: number,
  ): Promise<PlntJrnl> {
    return this.plntJrnlService.find(userSno, plntJrnlSno);
  }

  @Post('/:userSno/journals')
  create(
    @Param('userSno') userSno: number,
    @Body() createPlntJrnlDto: CreatePlntJrnlDto,
  ): Promise<executeResponseDto> {
    return this.plntJrnlService.create(userSno, createPlntJrnlDto);
  }

  @Put('/:userSno/journals/:plntJrnlSno')
  update(
    @Param('userSno') userSno: number,
    @Param('plntJrnlSno') plntJrnlSno: number,
    @Body() updatePlntJrnlDto: UpdatePlntJrnlDto,
  ): Promise<executeResponseDto> {
    return this.plntJrnlService.update(userSno, plntJrnlSno, updatePlntJrnlDto);
  }

  @Delete('/:userSno/journals/:plntJrnlSno')
  delete(
    @Param('userSno') userSno: number,
    @Param('plntJrnlSno') plntJrnlSno: number,
  ): Promise<executeResponseDto> {
    return this.plntJrnlService.delete(userSno, plntJrnlSno);
  }
}
