import { Controller, Get, Param } from '@nestjs/common';
import { Body, Post } from '@nestjs/common/decorators';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  // @Get(':id')
  // getUserById(@Param('id') id: string) {
  //   return this.userService.findById(parseInt(id));
  // }
}
