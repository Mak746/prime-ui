import { ParsedPhoneNumber, parsePhoneNumber } from 'awesome-phonenumber';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

export const parsePhone = (phone: string, regionCode: string = 'ET'): ParsedPhoneNumber => {
  return parsePhoneNumber(phone, { regionCode });
};

export const normalizePhoneSearchTerm = (searchQry: string) => {
  const qryParam = encodeURIComponent(searchQry.trim().replace('+', '')).replace('%20', '');
  let searchTerm = qryParam;
  if (qryParam.startsWith('0')) {
    searchTerm = qryParam.slice(1);
  } else if (qryParam.startsWith('251')) {
    searchTerm = qryParam.slice(3);
  } else if (qryParam.startsWith('+251')) {
    searchTerm = qryParam.slice(4);
  }
  return searchTerm;
};

@ValidatorConstraint({ async: true })
export class IsPhoneNumberValidConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return typeof value === 'string' && typeof relatedValue === 'string' && parsePhone(value).valid;
  }
}

export function IsPhoneNumberValid(validatieOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPhoneNumberValid',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validatieOptions,
      validator: IsPhoneNumberValidConstraint,
    });
  };
}
