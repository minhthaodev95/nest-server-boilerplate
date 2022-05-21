import { NotFoundException } from '@nestjs/common';

export class UserExistedException extends NotFoundException {
  constructor(error?: string) {
    super('error.user.existed', error);
  }
}
