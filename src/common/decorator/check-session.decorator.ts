import { SetMetadata } from '@nestjs/common';

export const CheckSession = (key: string = 'code') => {
  return SetMetadata('checkSession', key);
};
