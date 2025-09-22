import { SetMetadata } from '@nestjs/common';

export const InstitutionRoles = (...roles: string[]) => {
  return SetMetadata('institutionRoles', roles);
};
