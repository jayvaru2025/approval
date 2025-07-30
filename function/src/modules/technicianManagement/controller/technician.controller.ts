import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { TechnicianDetail } from '../../../types/types';
import { v4 as uuid } from 'uuid';
import {
  addTechnicianDetails,
  checkTechnicianExists,
  deleteConnectTechnicianUser,
  editTechnicianStatus,
  fetchTechnicianStatus,
  getAllTechnicianDetails,
  getTechnicianDetailsWithLimit,
  getAllTechnicianStatus,
  updateConnectTechnicianUser,
  addFavouriteUser,
  removeFavouriteUser,
  getTechnicianLocationTracking,
  addTechnicianLocationTracking,
} from '../service/technician.service';
import { sendEmailWithContent } from '../../services/email.service';
import { customLogger } from '../../../utils/logger';
import { getTableNames } from '../../../types/constants/constant';
import { removeDynamoDBItem, updateDynamoDBItemById } from '../../aws/dynamodb.service';
import bcrypt from 'bcryptjs';
import { adminTenantService } from '../../services/tenant.service';
import { getObject } from '../../aws/s3.service';
import { getConfig } from '../../../utils/config';
import { generateCompliantPassword } from '../../../utils/password.util';
import globalStore from '../../../utils/global';

const logger = customLogger('controller::technician.controller');

export const addTechnician = async (req: Request, res: Response) => {
  try {
    const { tenantId, awsResourcePrefix: prefix } = req;

    const technicianDetails = req.body.technicianDetails as TechnicianDetail;

    if (technicianDetails?.firstName && technicianDetails?.lastName) {
      technicianDetails.searchUserName =
        technicianDetails.firstName.toLowerCase() + ' ' + technicianDetails.lastName.toLowerCase();
      technicianDetails.userName =
        technicianDetails.firstName.toLowerCase() + ' ' + technicianDetails.lastName.toLowerCase();
    }

    const length = 15;
    const saltRound: number = 10;
    let base64Url;
    let BusinessName;
    try {
      const tenantDetails = await adminTenantService(tenantId);
      BusinessName = tenantDetails.BusinessName;
      const clientUrl = tenantDetails.clientUrl;
      const splittedLogoPath = clientUrl.split('/');
      const bucket = splittedLogoPath[0];
      const key = splittedLogoPath.slice(1).join('/');
      const response = await getObject(bucket, key);
      base64Url = await response.Body.transformToString('base64');
    } catch (error) {
      base64Url = '';
    }

    const cryptoTempPassword = generateCompliantPassword(length);

    const bcryptTempPassword = await bcrypt.hash(cryptoTempPassword, saltRound);
    const updatedAddress = technicianDetails.address.map((add) => {
      return { ...add, id: uuid(), coordinates: { lat: '', long: '' }, default: true, type: 'Home' };
    });

    if (technicianDetails?.email) {
      technicianDetails.email = technicianDetails.email.toLowerCase();
    }

    const updatedTechnacianDetails = {
      ...technicianDetails,
      address: updatedAddress,
      temporaryPassword: bcryptTempPassword,
      allowTemporaryPassword: true,
      totalAppointmentServed: null,
      averageRating: null,
      preferences: {
        appointmentReminders: true,
        contactMethods: ['email', 'phone', 'text'],
        serviceInterest: ['Commercial', 'Emergency', 'Lighting', 'Smart Home', 'eng'],
        servicePromotions: false,
        tenantId,
      },
    };

    await addTechnicianDetails(tenantId, updatedTechnacianDetails, prefix);

    const { firstName, lastName, email } = technicianDetails;
    const { SOURCE_EMAIL_ADDRESS, DOMAIN } = getConfig();
    let isMailSend = false;
    try {
      await sendEmailWithContent(
        `${firstName}  ${lastName}`,
        cryptoTempPassword,
        `https://${prefix}.${DOMAIN}/admin/login`,
        BusinessName,
        SOURCE_EMAIL_ADDRESS,
        email,
        base64Url ? `data:image/svg+xml;base64,${base64Url}` : null,
        technicianDetails.userType === 'TECHNICIAN' ? 'Technician' : 'Admin',
      );
      isMailSend = true;
    } catch (error) {
      isMailSend = false;
      logger.error('Error while sending the mail: ', error);
    }
    if (isMailSend) {
      return res.status(StatusCodes.OK).json({
        message: 'Technician Added successfully',
        isMailSend,
      });
    } else {
      return res.status(StatusCodes.OK).json({
        message: 'Technician Added successfully. Email sending failed.',
        isMailSend,
      });
    }
  } catch (error) {
    logger.error(`Error while adding technician `, error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error while adding technician', status: false, error: error });
  }
};

export const getTechnicians = async (req: Request, res: Response) => {
  try {
    const prefix = req.awsResourcePrefix;
    const { limit, lastEvaluatedKey, sortBy, sortOrder, searchedKeyWord } = req.query as {
      limit?: string;
      lastEvaluatedKey?: string;
      sortBy?: string;
      sortOrder?: string;
      searchedKeyWord?: string;
    };

    const tenantId = req.params?.tenantId || req.query?.tenantId || req.header('tenantId') || req.body || null;
    if (limit) {
      const records = await getTechnicianDetailsWithLimit(
        prefix,
        Number(limit),
        lastEvaluatedKey,
        tenantId,
        sortBy || '',
        sortOrder || 'asc',
        searchedKeyWord || '',
      );

      return res.status(StatusCodes.OK).json({
        message: 'technician fetched successfully',
        result: records.response,
        lastEvaluatedKey: records.lastEvaluatedKey,
      });
    } else {
      const records = await getAllTechnicianDetails(prefix);

      return res.status(StatusCodes.OK).json({
        message: 'technician fetched successfully',
        result: records,
      });
    }
  } catch (error) {
    logger.error(`Error while fetching technician details `, error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error while fetching technician details', status: false, error: error });
  }
};
export const updateTechnicianStatus = async (req: Request, res: Response) => {
  try {
    const { userEmail, id } = req.body;
    const prefix = req.awsResourcePrefix;
    if (!userEmail || !id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: `${!userEmail ? 'userEmail is required' : 'status id is required'}`,
      });
    }
    const editTechnicianStatusResponse = await editTechnicianStatus(prefix, userEmail, id);

    return res.status(StatusCodes.OK).json(editTechnicianStatusResponse);
  } catch (error) {
    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    logger.error(`Error while updating technician status `, error);
    // let errorMessage = 'An unexpected error occurred while updating technician status.';
    let errorMessage = error.message;
    if (error instanceof Error) {
      if (error.message.includes('Technician not found')) {
        statusCode = StatusCodes.NOT_FOUND;
        errorMessage = error.message;
      } else if (error.message.includes('AWS resource not found')) {
        errorMessage = 'AWS resource could not be retrieved.';
        statusCode = StatusCodes.NOT_FOUND;
      }
    }
    return res.status(statusCode).json({ message: errorMessage });
  }
};
export const getTechnicianStatus = async (req: Request, res: Response) => {
  try {
    const userEmail = req.query.userEmail as string;
    const prefix = req.awsResourcePrefix;
    if (!userEmail) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'userEmail is required',
      });
    }

    const fetchTechnicianStatusResponse = await fetchTechnicianStatus(prefix, userEmail);

    return res.status(StatusCodes.OK).json(fetchTechnicianStatusResponse);
  } catch (error) {
    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    logger.error(`Error while fetching technician status:`, error);
    let errorMessage = error.message;

    if (error instanceof Error) {
      if (error.message.includes('Technician not found')) {
        errorMessage = error.message;
        statusCode = StatusCodes.NOT_FOUND;
      } else if (error.message.includes('AWS resource not found')) {
        statusCode = StatusCodes.NOT_FOUND;
        errorMessage = 'AWS resource could not be retrieved.';
      } else if (error.message.includes('No agent status data found')) {
        statusCode = StatusCodes.NOT_FOUND;
        errorMessage = '`No agent status data found';
      }
    }
    return res.status(statusCode).json({ message: errorMessage });
  }
};

export const listTechnicianStatus = async (req: Request, res: Response) => {
  try {
    const prefix = req.awsResourcePrefix;
    const listTechnicianStatusResponse = await getAllTechnicianStatus(prefix);

    return res.status(StatusCodes.OK).json(listTechnicianStatusResponse);
  } catch (error) {
    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    logger.error(`Error while fetching list of technician status `, error);
    let errorMessage = error.message;
    if (error instanceof Error) {
      if (error.message.includes('AWS resource not found')) {
        errorMessage = 'AWS resource could not be retrieved.';
        statusCode = StatusCodes.NOT_FOUND;
      }
    }
    return res.status(statusCode).json({ message: errorMessage });
  }
};

export const verifyTechnician = async (req: Request, res: Response) => {
  try {
    const prefix = req.awsResourcePrefix;
    const { email } = req.query;

    const record = await checkTechnicianExists(prefix, String(email));

    if (record) {
      return res.status(StatusCodes.OK).json({ message: 'Technician already exits with this email', result: true });
    }

    return res.status(StatusCodes.OK).json({ message: 'Technician not exists', result: false });
  } catch (error) {
    logger.error(`Error while checking Technician exists `, error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error while checking Technician exists', status: false, error: error });
  }
};

export const updateTechnicianDetails = async (req: Request, res: Response) => {
  try {
    const prefix = req.awsResourcePrefix;
    const { ...technicianDetail } = req.body;
    const { id } = req.params;
    if (technicianDetail?.firstName && technicianDetail?.lastName) {
      technicianDetail.searchUserName =
        technicianDetail.firstName.toLowerCase() + ' ' + technicianDetail.lastName.toLowerCase();
      technicianDetail.userName =
        technicianDetail.firstName.toLowerCase() + ' ' + technicianDetail.lastName.toLowerCase();
    }

    if (technicianDetail?.email) {
      technicianDetail.email = technicianDetail.email.toLowerCase();
    }

    await updateConnectTechnicianUser(prefix, id, technicianDetail);

    await updateDynamoDBItemById(`${prefix}${getTableNames(prefix).USER_DETAILS}`, id, technicianDetail);

    return res.status(StatusCodes.OK).json({ message: 'technician updated successfully' });
  } catch (error) {
    logger.error(`Error while updating technician details `, error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error while updating technician details', status: false, error: error });
  }
};

export const deleteTechnician = async (req: Request, res: Response) => {
  try {
    const prefix = req.awsResourcePrefix;
    const { id } = req.params;
    await deleteConnectTechnicianUser(prefix, id);
    await removeDynamoDBItem(`${prefix}${getTableNames(prefix).USER_DETAILS}`, { id });

    return res.status(StatusCodes.OK).json({ message: 'technician deleted successfully', status: true });
  } catch (error) {
    logger.error(`Error while deleting technician details `, error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error while deleting technician details', status: false, error: error });
  }
};

export const addFavourite = async (req: Request, res: Response) => {
  try {
    const prefix = req.awsResourcePrefix;
    const { customerId } = req.body;

    const { id } = req.params;

    await addFavouriteUser(prefix, id, customerId);

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Customer has been successfully added to favourites.', status: true });
  } catch (error) {
    logger.error(`Error while adding favourite `, error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error while adding favourite', status: false, error: error });
  }
};

export const removeFavourite = async (req: Request, res: Response) => {
  try {
    const prefix = req.awsResourcePrefix;
    const { customerId } = req.body;

    const { id } = req.params;

    await removeFavouriteUser(prefix, id, customerId);

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Customer has been successfully removed from favourites.', status: true });
  } catch (error) {
    logger.error(`Error while removing favourite `, error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error while removing favourite', status: false, error: error });
  }
};

export const updateTechnicianLocation = async (req: Request, res: Response) => {
  try {
    const { technicianId, longitude, latitude } = req.body;
    const { awsResourcePrefix: prefix } = req;
    if (!technicianId || longitude === undefined || latitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'technicianId, longitude, and latitude are required',
      });
    }

    const trackingData = await addTechnicianLocationTracking(technicianId, longitude, latitude, prefix);

    return res.status(200).json({
      success: true,
      message: 'Technician location updated successfully',
      data: trackingData,
    });
  } catch (error) {
    logger.error(`Error in updateTechnicianLocation controller: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while updating technician location',
    });
  }
};

export const getTechnicianLocation = async (req: Request, res: Response) => {
  try {
    const { technicianId } = req.params;
    const { awsResourcePrefix: prefix } = req;

    if (!technicianId) {
      return res.status(400).json({
        success: false,
        message: 'technicianId is required in route parameters',
      });
    }

    const locationData = await getTechnicianLocationTracking(technicianId, prefix as string);

    if (!locationData) {
      return res.status(404).json({
        success: false,
        message: 'No location tracking data found for this technician',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Technician location retrieved successfully',
      data: locationData,
    });
  } catch (error) {
    logger.error(`Error in getTechnicianLocation controller: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving technician location',
    });
  }
};
