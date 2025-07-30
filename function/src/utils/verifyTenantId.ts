import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getTenantAwsResourcePrefix } from '../modules/services/tenant.service';
import { ResponseStatus } from '../types/constants/constant';
import globalStore from './global';

export const verifyTenantId = async (req: any, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.params?.tenantId || req.query?.tenantId || req.header('tenantId') || req.body || null;

    if (!tenantId) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'tenantId is required', status: ResponseStatus.FAIL });
    }

    if (tenantId) {
      const prefix = await getTenantAwsResourcePrefix(tenantId);
      globalStore.setConnectResourcePrefix(prefix?.awsResourcePrefix, prefix?.connectResourcePrefix);
      req.tenantId = tenantId;
      req.awsResourcePrefix = prefix?.awsResourcePrefix;
    }

    next();
  } catch (error) {
    console.error('Unexpected error in middleware:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Error while fetching tenant details',
      status: ResponseStatus.FAIL,
      error: error instanceof Error ? error.message : error,
    });
  }
};
