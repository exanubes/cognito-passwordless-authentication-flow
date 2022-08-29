import { SetMetadata } from '@nestjs/common';

export const PUBLIC_ROUTE_KEY = 'isPublic';
export const PublicRoute = () => SetMetadata(PUBLIC_ROUTE_KEY, true);
