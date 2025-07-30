import { GetCommandInput, QueryCommandInput, ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import { getTableNames } from '../../../types/constants/constant';
import { FavouriteCustomersType, TechnicianDetail } from '../../../types/types';
import { customLogger } from '../../../utils/logger';
import {
  addDynamoDBItem,
  getDynamoDBAllItems,
  getDynamoDBItem,
  getDynamoDBItems,
  putDynamoDBItem,
  updateDynamoDBItemById,
} from '../../aws/dynamodb.service';
import { v4 as uuid } from 'uuid';
import {
  CreateUserCommandInput,
  GetCurrentUserDataCommandInput,
  ListAgentStatusesCommandInput,
  UpdateUserIdentityInfoCommandInput,
} from '@aws-sdk/client-connect';
import {
  createConnectUser,
  deleteConnectUser,
  getAgentStatus,
  listAgentStatus,
  updateAgentStatus,
  updateConnectUser,
} from '../../aws/connect.service';
import { getConnectResourceDetails } from '../../services/phoneNumber.service';
import globalStore from '../../../utils/global';
import moment from 'moment';

const logger = customLogger('service::technician.service');

export const addTechnicianDetails = async (tenantId: string, technicianDetail: TechnicianDetail, prefix: string) => {
  try {
    const id = uuid();
    const response = await createConnectTechnicianUser(prefix, id, technicianDetail);

    await addDynamoDBItem(`${prefix}${getTableNames(prefix).USER_DETAILS}`, {
      ...technicianDetail,
      ...response,
      id,
      tenantId,
    });
  } catch (error) {
    logger.error(`Error while adding technician details : ${error}`);
    throw error;
  }
};

export const getAllTechnicianDetails = async (prefix: string) => {
  try {
    const scanCommand: ScanCommandInput = {
      TableName: `${prefix}${getTableNames(prefix).USER_DETAILS}`,
    };
    const records = await getDynamoDBAllItems(scanCommand);
    return records.Items;
  } catch (error) {
    logger.error(`Error while fetching customer details `, error);
    throw error;
  }
};

const fetchSortedOrFilteredUsers = async ({
  prefix,
  sortBy,
  sortOrder,
  searchedKeyWord,
  tenantId,
  limit,
  exclusiveKey,
}: {
  prefix: string;
  sortBy: string;
  sortOrder: string;
  searchedKeyWord: string;
  tenantId: string;
  limit: number;
  exclusiveKey: Record<string, any>;
}) => {
  let scanCommand: QueryCommandInput | ScanCommandInput;
  let records;
  let indexName: string;

  if ((sortBy.trim().length > 0 && sortOrder.trim().length > 0) || searchedKeyWord.trim().length !== 0) {
    if (sortBy === 'email') {
      indexName = 'tenantId-email-index';
    } else {
      indexName = 'tenantId-userName-index';
    }
    scanCommand = {
      TableName: `${prefix}${getTableNames(prefix).USER_DETAILS}`,
      IndexName: indexName,
      KeyConditionExpression: 'tenantId = :tid',
      ExpressionAttributeValues: {
        ':tid': tenantId,
      },
      ScanIndexForward: sortOrder === 'asc',
    };
    if (searchedKeyWord && searchedKeyWord.trim().length !== 0) {
      const normalizeSpace = (str) => str.trim().replace(/\s+/g, ' ');
      const normalizedUserName = normalizeSpace(searchedKeyWord.toLowerCase());
      scanCommand.FilterExpression = `contains(searchUserName, :search)`;
      scanCommand.ExpressionAttributeValues[':search'] = normalizedUserName;
    }
    scanCommand.ExclusiveStartKey = exclusiveKey;
    scanCommand.Limit = limit;
    records = await getDynamoDBItems(scanCommand);
  } else {
    scanCommand = {
      TableName: `${prefix}${getTableNames(prefix).USER_DETAILS}`,
      ExclusiveStartKey: exclusiveKey,
      Limit: limit,
    };
    records = await getDynamoDBAllItems(scanCommand);
  }
  return records;
};
export const getTechnicianDetailsWithLimit = async (
  prefix: string,
  limit: number,
  lastEvaluatedKey: string,
  tenantId: string,
  sortBy?: string,
  sortOrder?: string,
  searchedKeyWord?: string,
) => {
  try {
    const fetchedRecords: any[] = [];
    let exclusiveKey = lastEvaluatedKey ? JSON.parse(lastEvaluatedKey) : undefined;
    let retryAfterEmpty = false;
    while (fetchedRecords.length <= limit) {
      const records = await fetchSortedOrFilteredUsers({
        prefix,
        sortBy,
        sortOrder,
        searchedKeyWord,
        tenantId,
        limit,
        exclusiveKey,
      });
      if (!records || !records.Items || records.Items.length === 0) {
        // If this is our first empty result and we have a LastEvaluatedKey, try one more time
        if (records && records.LastEvaluatedKey && !retryAfterEmpty) {
          exclusiveKey = records.LastEvaluatedKey;
          retryAfterEmpty = true;
          continue;
        }

        break;
      }
      fetchedRecords.push(...records.Items);
      if (fetchedRecords.length >= limit || !records.LastEvaluatedKey) {
        exclusiveKey = records.LastEvaluatedKey;
        break;
      }
      exclusiveKey = records.LastEvaluatedKey;
      retryAfterEmpty = false;
    }
    const finalRecords = fetchedRecords.slice(0, limit);

    let newLastEvaluatedKey;
    if ((sortBy.trim().length > 0 && sortOrder.trim().length > 0) || searchedKeyWord.trim().length !== 0) {
      if (sortBy === 'email') {
        newLastEvaluatedKey =
          finalRecords.length >= limit
            ? {
                id: finalRecords[finalRecords.length - 1].id,
                email: finalRecords[finalRecords.length - 1].email,
                tenantId: finalRecords[finalRecords.length - 1].tenantId,
              }
            : null;
      } else {
        newLastEvaluatedKey =
          finalRecords.length >= limit
            ? {
                id: finalRecords[finalRecords.length - 1].id,
                userName: finalRecords[finalRecords.length - 1].userName,
                tenantId: finalRecords[finalRecords.length - 1].tenantId,
              }
            : null;
      }
    } else {
      newLastEvaluatedKey =
        finalRecords.length >= limit
          ? {
              id: finalRecords[finalRecords.length - 1].id,
            }
          : null;
    }

    return {
      response: finalRecords,
      lastEvaluatedKey: newLastEvaluatedKey ? JSON.stringify(newLastEvaluatedKey) : null,
    };
  } catch (error) {
    logger.error(`Error while fetching customer details `, error);
    throw error;
  }
};

export const editTechnicianStatus = async (prefix: string, email: string, statusId: string) => {
  try {
    const userDetails = await checkTechnicianExists(prefix, email);
    if (!userDetails) {
      logger.error(`Technician not found for email: ${email}`);
      throw new Error('Technician not found for the provided email.');
    }

    const connectAgentId: string = userDetails.agentConnectId;
    const connectResourceDetails = await getConnectResourceDetails(prefix);
    if (!connectResourceDetails || !connectResourceDetails.length) {
      logger.error('AWS Connect resource details not found.');
      throw new Error('AWS resource not found.');
    }

    const queues = connectResourceDetails[0].queues;
    const instanceArn = queues.chatQueue.arn;
    const instanceId: string = instanceArn.split('/')[1];
    const input = {
      InstanceId: instanceId,
      AgentStatusId: statusId,
      UserId: connectAgentId,
    };
    const updateStatusResponse = await updateAgentStatus(input);
    if (!updateStatusResponse || updateStatusResponse.$metadata.httpStatusCode !== 200) {
      logger.error(`Failed to update agent status for agent: ${connectAgentId}`);
      throw new Error('Failed to update agent status.');
    }

    return { message: 'Technician status updated successfully' };
  } catch (error) {
    logger.error(`Error while updating technician status `, error);
    throw error;
  }
};

export const getAllTechnicianStatus = async (prefix: string) => {
  try {
    const connectResourceDetails = await getConnectResourceDetails(prefix);
    if (!connectResourceDetails || !connectResourceDetails.length) {
      logger.error('AWS Connect resource details not found.');
      throw new Error('AWS resource not found.');
    }
    const queues = connectResourceDetails[0].queues;
    const instanceArn = queues.chatQueue.arn;
    const instanceId: string = instanceArn.split('/')[1];
    const input: ListAgentStatusesCommandInput = {
      InstanceId: instanceId,
    };
    const connectApiResponse = await listAgentStatus(input);
    if (!connectApiResponse || connectApiResponse.$metadata.httpStatusCode !== 200) {
      logger.error(`Failed to fetch the list of  agent statuses`);
      throw new Error('Failed to fetch the list of agent statuses.');
    }
    const agentStatusList = connectApiResponse.AgentStatusSummaryList.map(({ Id, Name }) => ({
      id: Id,
      name: Name,
    }));

    return { message: 'Technician status list fetched successfully', agentStatusList };
  } catch (error) {
    logger.error(`Error while fetching list of technician statuses `, error);
    throw error;
  }
};
export const fetchTechnicianStatus = async (prefix: string, email: string) => {
  try {
    const userDetails = await checkTechnicianExists(prefix, email);
    if (!userDetails) {
      logger.error(`Technician not found for email: ${email}`);
      throw new Error('Technician not found for the provided email.');
    }

    const connectAgentId: string = userDetails.agentConnectId;
    const connectResourceDetails = await getConnectResourceDetails(prefix);
    if (!connectResourceDetails || !connectResourceDetails.length) {
      logger.error('AWS Connect resource details not found.');
      throw new Error('AWS resource not found.');
    }

    const queues = connectResourceDetails[0].queues;
    const instanceArn = queues.chatQueue.arn;
    const instanceId: string = instanceArn.split('/')[1];
    const inputCommand: GetCurrentUserDataCommandInput = {
      InstanceId: instanceId,
      Filters: {
        Agents: [connectAgentId],
      },
    };
    const agentStatusDetails = await getAgentStatus(inputCommand);
    if (agentStatusDetails && agentStatusDetails.UserDataList.length === 0) {
      const technicianStatusList = await getAllTechnicianStatus(prefix);
      const agentStatus = technicianStatusList.agentStatusList.find((status) => status.name === 'Offline');
      return { message: 'Technician status fetched successfully', agentStatus: agentStatus };
    }
    if (!agentStatusDetails || !agentStatusDetails.UserDataList.length) {
      logger.error(`No agent status data found for agent: ${connectAgentId}`);
      throw new Error('No agent status data found.');
    }

    const agentStatus = agentStatusDetails.UserDataList.map(({ Status }) => ({
      id: Status.StatusArn.split('/').pop(),
      name: Status.StatusName,
    }))[0];

    return { message: 'Technician status fetched successfully', agentStatus };
  } catch (error) {
    logger.error(`Error while fetching technician status:`, error);
    throw error;
  }
};

export const checkTechnicianExists = async (prefix: string, email: string) => {
  try {
    const params: QueryCommandInput = {
      TableName: `${prefix}${getTableNames(prefix).USER_DETAILS}`,
      IndexName: 'email-index',
      KeyConditionExpression: `#email = :email`,
      ExpressionAttributeNames: {
        '#email': 'email',
      },
      ExpressionAttributeValues: {
        ':email': email,
      },
    };

    const records = await getDynamoDBItems(params);

    return records.Items[0];
  } catch (error) {
    logger.error(`Error while getting email from dynamodb, error: ${error}`);
    throw error;
  }
};

export const createConnectTechnicianUser = async (prefix: string, id: string, user: TechnicianDetail) => {
  try {
    const { firstName, lastName, email, phoneNumber } = user;

    const resource = (await getDynamoDBAllItems({ TableName: `${prefix}${getTableNames(prefix).CONNECT_RESOURCE}` }))
      .Items[0];

    const instanceId = resource.securityProfiles.arn.split('/')[1];

    const routingProfileId = resource.routingProfiles.basicProfile.arn.split('/')[3];
    const securityProfileId = resource.securityProfiles.arn.split('/')[3];

    const input: CreateUserCommandInput = {
      Username: email,
      IdentityInfo: {
        FirstName: firstName,
        LastName: lastName ?? '',
        Mobile: phoneNumber.includes('+') ? `${phoneNumber}` : `+1${phoneNumber}`,
      },
      PhoneConfig: {
        PhoneType: 'SOFT_PHONE',
      },
      SecurityProfileIds: [securityProfileId],
      RoutingProfileId: routingProfileId,
      InstanceId: instanceId,
      Tags: resource.tags ?? {},
    };

    const { UserId, UserArn } = await createConnectUser(input);

    return { agentConnectId: UserId, agentConnectArn: UserArn };
  } catch (error) {
    logger.error('Error creating user:', error);
    throw error;
  }
};

export const deleteConnectTechnicianUser = async (prefix: string, technicianId: string) => {
  try {
    const params: GetCommandInput = {
      TableName: `${prefix}${getTableNames(prefix).USER_DETAILS}`,
      Key: { id: technicianId },
    };

    const { agentConnectArn } = (await getDynamoDBItem(params)).Item as TechnicianDetail;
    const instanceId = agentConnectArn.split('/')[1];
    const userId = agentConnectArn.split('/')[3];

    const input = {
      InstanceId: instanceId,
      UserId: userId,
    };

    await deleteConnectUser(input);
  } catch (error) {
    logger.error('Error deleting user:', error);
    throw error;
  }
};

export const updateConnectTechnicianUser = async (
  prefix: string,
  technicianId: string,
  technicianDetail: TechnicianDetail,
) => {
  try {
    const params: GetCommandInput = {
      TableName: `${prefix}${getTableNames(prefix).USER_DETAILS}`,
      Key: { id: technicianId },
    };

    const { agentConnectArn } = (await getDynamoDBItem(params)).Item as TechnicianDetail;
    const instanceId = agentConnectArn.split('/')[1];
    const userId = agentConnectArn.split('/')[3];
    const { firstName, lastName, phoneNumber } = technicianDetail;

    const input: UpdateUserIdentityInfoCommandInput = {
      InstanceId: instanceId,
      UserId: userId,
      IdentityInfo: {
        FirstName: firstName,
        LastName: lastName,
        Mobile: phoneNumber,
      },
    };

    await updateConnectUser(input);
  } catch (error) {
    logger.error('Error updating user:', error);
    throw error;
  }
};

export const addFavouriteUser = async (prefix: string, technicianId: string, customerId: string) => {
  try {
    const params: GetCommandInput = {
      TableName: `${prefix}${getTableNames(prefix).USER_DETAILS}`,
      Key: { id: technicianId },
    };

    const { favouriteCustomers } = (await getDynamoDBItem(params)).Item as {
      favouriteCustomers: FavouriteCustomersType[];
    };

    const favouritesArr = favouriteCustomers ? favouriteCustomers : [];

    favouritesArr.push({ id: customerId });

    await updateDynamoDBItemById(`${prefix}${getTableNames(prefix).USER_DETAILS}`, technicianId, {
      favouriteCustomers: favouritesArr,
    });

    return favouritesArr;
  } catch (error) {
    logger.error('Error updating user:', error);
    throw error;
  }
};

export const removeFavouriteUser = async (prefix: string, technicianId: string, customerId: string) => {
  try {
    const params: GetCommandInput = {
      TableName: `${prefix}${getTableNames(prefix).USER_DETAILS}`,
      Key: { id: technicianId },
    };

    const { favouriteCustomers } = (await getDynamoDBItem(params)).Item as {
      favouriteCustomers: FavouriteCustomersType[];
    };

    const favouritesArr = favouriteCustomers ? favouriteCustomers : [];

    const updatedFavourites = favouritesArr.filter((favourite) => favourite.id !== customerId);

    await updateDynamoDBItemById(`${prefix}${getTableNames(prefix).USER_DETAILS}`, technicianId, {
      favouriteCustomers: updatedFavourites,
    });

    return updatedFavourites;
  } catch (error) {
    logger.error('Error removing user from favourites:', error);
    throw error;
  }
};

export const addTechnicianLocationTracking = async (
  technicianId: string,
  longitude: number,
  latitude: number,
  prefix: string,
) => {
  try {
    const trackingData = {
      technicianId: technicianId,
      longitude,
      latitude,
      updatedAt: moment.utc().toISOString(),
    };

    await putDynamoDBItem(`${prefix}${getTableNames(prefix).TECHNICIAN_LOCATION_TRACKING}`, trackingData);

    return trackingData;
  } catch (error) {
    logger.error(`Error while adding technician location tracking : ${error}`);
    throw error;
  }
};

export const getTechnicianLocationTracking = async (technicianId: string, prefix: string) => {
  try {
    const params: GetCommandInput = {
      TableName: `${prefix}${getTableNames(prefix).TECHNICIAN_LOCATION_TRACKING}`,
      Key: { technicianId: technicianId },
    };

    const result = await getDynamoDBItem(params);

    if (!result.Item) {
      return null;
    }

    return result.Item as {
      technicianId: string;
      longitude: number;
      latitude: number;
      updatedAt: string;
    };
  } catch (error) {
    logger.error(`Error while getting technician location tracking: ${error}`);
    throw error;
  }
};
