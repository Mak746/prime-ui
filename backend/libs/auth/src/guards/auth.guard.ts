import { CHANNEL, Channel, PUBLIC_ENDPOINT, ROLE, Roles } from '@app/shared';
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { TokenService } from '../services';
// import { inflateSync } from 'zlib';

@Injectable()
export class AuthenticationGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
    private readonly _tokenService: TokenService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean | undefined> {
    try {
      const request = context.switchToHttp().getRequest();
      // const { method, path } = request;
      let channel: Channel = 'WEB';

      // If @Public Decorator - Do not Authenticate
      const decoratorSkip =
        this._reflector.get(PUBLIC_ENDPOINT, context.getClass()) ||
        this._reflector.get(PUBLIC_ENDPOINT, context.getHandler());

      // Web Application Access
      const authorizationHeader = request.header('Authorization');

      // Mobile Application Access
      const xAccessToken = request.header('x-access-token');

      // API Access
      const xApiToken = request.header('x-api-token');

      // REQUEST CHANNEL
      if (xAccessToken) {
        channel = CHANNEL.APP;
      }
      if (xApiToken) {
        channel = CHANNEL.API;
      }

      //---------------------------------------------
      // Authorization Header
      //---------------------------------------------
      const authorizationHeaderParts = authorizationHeader ? authorizationHeader.split(' ') : [];
      const isAuthorizationPartsAvaliable = authorizationHeaderParts && authorizationHeaderParts.length === 2;
      const authorizationBearer: string = isAuthorizationPartsAvaliable ? authorizationHeaderParts[0] : '';
      const authorizationToken: string = isAuthorizationPartsAvaliable ? authorizationHeaderParts[1] : '';

      if (decoratorSkip) return true;

      if (
        channel === CHANNEL.WEB &&
        (!isAuthorizationPartsAvaliable ||
          !authorizationBearer ||
          authorizationBearer.trim().toLowerCase() !== 'bearer')
      ) {
        throw new HttpException('Authorization: Bearer <token> header empty or invalid', HttpStatus.UNAUTHORIZED);
      }

      // Authenticate User
      let requestUser;
      switch (channel) {
        case CHANNEL.APP:
          requestUser = await this._tokenService.verifyAccessToken(xAccessToken);
          break;
        case CHANNEL.WEB:
          requestUser = await this._tokenService.verifyAccessToken(authorizationToken);
          break;
        case CHANNEL.API:
          requestUser = await this._tokenService.verifyAccessToken(xApiToken);
          break;
      }

      if (!requestUser) {
        throw new HttpException('Authorization: Invalid Credentials', HttpStatus.UNAUTHORIZED);
      }

      // Allowed Roles for the request...

      const allowedRoles = this._reflector.getAllAndOverride<string[]>('roles', [
        context.getHandler(),
        context.getClass(),
      ]);
      const rolesDefinedForRoute = allowedRoles && allowedRoles.length > 0;
      const userHasRolePermission =
        (rolesDefinedForRoute && requestUser && requestUser?.role && allowedRoles.includes(requestUser?.role)) ||
        !rolesDefinedForRoute;

      if (!userHasRolePermission) {
        throw new HttpException('Unavailable or Forbidden resource access', HttpStatus.FORBIDDEN);
      }

      // SET REQUEST ...
      request['user'] = requestUser;
      request['channel'] = channel;

      // Save professional id in request if user is professional User
      if (requestUser?.role === ROLE.PROFESSIONAL_USER) {
        request['professionalId'] = requestUser.professionalId;
      }

      if (requestUser?.role === ROLE.PATIENT_USER) {
        request['patientId'] = requestUser.patientId;
      }

      // If User's role is Institutition User
      // check if the current route is only for institituition users only
      if (requestUser?.role == ROLE.INSTITUTION_USER) {
        // @ts-ignore
        const allowedInstitutionRoles = this._reflector.getAllAndOverride<string[]>('institutionRoles', [
          context.getHandler(),
          context.getClass(),
        ]);

        const institutionRolesDefinedForRoute = allowedInstitutionRoles && allowedInstitutionRoles.length > 0;
        const institutionUserHasPermission =
          (institutionRolesDefinedForRoute &&
            requestUser &&
            requestUser?.institutionRole &&
            allowedInstitutionRoles.includes(requestUser?.institutionRole)) ||
          !institutionRolesDefinedForRoute;
        if (!institutionUserHasPermission) {
          throw new HttpException(
            'Institution User doesnt have access to the specified resource',
            HttpStatus.FORBIDDEN,
          );
        }
        request['institutionRole'] = requestUser.institutionRole;
        request['institutionId'] = requestUser.institutionId;
        //request['institutionUserId'] = requestUser.institutionUserId;
      }

      // TODO: normal users should be given a role. either USER or PATIENT. please fix this
      //request['patientId'] = requestUser.patientId;

      // ALL good !
      return true;
    } catch (e) {
      Logger.error({ message: `msg: ${e?.message}`, stack: e, context: AuthenticationGuard.name });

      throw e;
    }
  }
}
