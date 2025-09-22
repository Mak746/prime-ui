import { CustomerRole, IRequestInfo, Role } from '@app/shared';
import { AgentBuilder } from './agent.builder';
import { PatientUserBuilder } from './euser-builder';
import { IUserBuilder } from './interfaces';
import { RegisterAgentDto, RegisterPatientUserDto, RegisterInstitutionUserDto } from './request-dtos';
import { ProfessionalUserBuilder } from './professional-user.builder';
import { RegisterProfessionalUserDto } from './request-dtos/professional-user.dto';
import { InstitutionUserBuilder } from './institution-users.builder';

export * from './base';
export * from './interfaces';
export * from './request-dtos';
// builders
export * from './admins.builder';
export * from './agent.builder';
export * from './euser-builder';
export * from './euser-social-builder';
export * from './institution-users.builder';

// Builders Factory

export class CustomerFactory {
  public static get<T extends { role: Role }>(dto: T, requestInfo: IRequestInfo): IUserBuilder {
    const { role, ..._dto } = dto;
    switch (role) {
      case 'AGENT':
        return new AgentBuilder(_dto as unknown as RegisterAgentDto, requestInfo);
      case 'PATIENT_USER':
        return new PatientUserBuilder(_dto as unknown as RegisterPatientUserDto, requestInfo);
      case 'PROFESSIONAL_USER':
        return new ProfessionalUserBuilder(_dto as unknown as RegisterProfessionalUserDto, requestInfo);
      case 'INSTITUTION_USER':
        return new InstitutionUserBuilder(_dto as unknown as RegisterInstitutionUserDto, requestInfo);
    }
  }
}
