import { getTableNames } from '../../types/constants/constant';
import { customLogger } from '../../utils/logger';
import { getDynamoDBAllItems } from '../aws/dynamodb.service';
import globalStore from '../../utils/global';

const connectResourcePrefix = globalStore.getConnectResourcePrefix();

const logger = customLogger('service::phoneNumber.service');

export const getConnectResourceDetails = async (prefix: string) => {
  try {
    const records = await getDynamoDBAllItems({
      TableName: `${prefix}${getTableNames(prefix).CONNECT_RESOURCE}`,
    });
    return records.Items;
  } catch (error) {
    logger.error(`Error while fetching customer details :`, error);
    throw error;
  }
};
