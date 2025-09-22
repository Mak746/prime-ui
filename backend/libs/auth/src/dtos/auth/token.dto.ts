import { IsOptional, IsString } from 'class-validator';
export type AzpType =
  | 'wc-customer-app'
  | 'wc-manager-app'
  | 'wc-customer-web'
  | 'wc-manager-web'
  | 'wc-customer-api'
  | 'wc-euser-app'
  | 'wc-euser-web';
export class TokenPayload {
  // token expiry time
  exp: number;
  // time token issued at
  iat: number;
  // token type: Bearer | Refresh
  typ: string;
  // "http://localhost:8080/auth/realms/tp_admin"
  iss: string;
  // evd-customer-app | evd-manager-app | evd-customer-web | evd-manager-web | evd-customer-api
  azp: AzpType;
  // subject: users identity id (user's unique uuid) - exposed externally
  sub: string;
  // user role
  role: string;
  // realm (role category) could be 'ADMIN' or 'CUSTOMER'
  realm: string;
}
export class RefreshTokenPayload extends TokenPayload {}
export class AccessTokenPayload extends TokenPayload {
  // user's name
  name: string;
  // user's phone no
  phone: string;
  // users email
  email: string;
  // user id
  uid: number;
  // customer id
  cid?: number;
  // parent customer id
  pcid: number;
  // user company id
  coid?: number;
  // user company ids
  coids?: number[];
  // allowed endpoint domain
  domain?: string;

  // for normal users
  patientId?: number;

  // for professional users
  professionalId?: number;

  // For Institution Users:
  // We would like to figure out user id, the institution they work at
  // and their role in the institution in the token
  institutionUserId?: number;
  institutionRole?: string;
  institutionId?: number;
}
export class AccessTokenDto {
  @IsString()
  accessToken: string;
}
export class RefreshTokenDto {
  @IsString()
  @IsOptional()
  refreshToken: string;
}

export class TokensDto {
  @IsString()
  access_token: string;

  @IsString()
  refresh_token: string;
}
export class TokensResponseDto {
  access_token?: string;
  refresh_token?: string;
  success: boolean;
  statusCode: number;
  message: string;
}
