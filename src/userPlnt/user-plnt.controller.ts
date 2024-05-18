import { Controller } from '@nestjs/common';
import { UserPlntService } from './user-plnt.service';

@Controller('userplnt')
export class UserPlntController {
  constructor(private readonly userPlntService: UserPlntService) {}

}
