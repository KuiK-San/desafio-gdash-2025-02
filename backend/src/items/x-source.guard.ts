import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class XSourceGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const header = req.headers['x-source'];

        if (header !== 'go-worker') {
            throw new ForbiddenException('Invalid source');
        }

        return true;
    }
}