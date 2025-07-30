import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus } from '../types/constants/constant';
import { getRoleById } from '../modules/role/service/role.service';

export const verifyPermissions = (permissions: string[]) => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      // Assuming req.tenantId and req.awsResourcePrefix are already set before this middleware

      const tenantId = req.tenantId;
      const prefix = req.awsResourcePrefix;

      if (!tenantId || !prefix) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Tenant ID or AWS resource prefix is missing' });
      }

      const user = req.user as { userName: string; id: string; email: string; roleId: string };

      const roleId = user?.roleId; // Assuming user ID is attached to req.user
      if (!roleId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not authenticated' });
      }

      const roleRecords = await getRoleById(prefix, roleId);
      const rolePermissions = roleRecords.permissions.map((el) => el.key) as string[];
      const hasPermission = permissions.some((permission) => rolePermissions.includes(permission));

      if (!hasPermission) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Insufficient permissions' });
      }

      req.permissions = rolePermissions;

      next();
    } catch (error) {
      console.error('Unexpected error in middleware:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error while fetching role details',
        error: error instanceof Error ? error.message : error,
      });
    }
  };
};
