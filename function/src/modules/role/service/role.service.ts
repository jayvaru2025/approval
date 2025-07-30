import { getTableNames } from '../../../types/constants/constant';
import { customLogger } from '../../../utils/logger';
import { getDynamoDBItem } from '../../aws/dynamodb.service';
import globalStore from '../../../utils/global';

const logger = customLogger('service::role.service');

export const getRoleById = async (prefix: string, id: string) => {
  try {
    const records = await getDynamoDBItem({
      TableName: `${prefix}${getTableNames(prefix).ROLE_PERMISSION_MAPPING_DETAILS}`,
      Key: { id: id.trim() },
    });
    return records.Item;
  } catch (error) {
    logger.error('Error while fetching role details by ID', error);
    throw new Error(`Error while fetching role details by ID: ${error.message || error}`);
  }
};
