import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { getTableNames } from '../../types/constants/constant';
import { customLogger } from '../../utils/logger';
import { getDynamoDBItem, getDynamoDBItems } from '../aws/dynamodb.service';

const logger = customLogger('adminTenant::service');

export const adminTenantService = async (id: string) => {
  try {
    const records = await getDynamoDBItem({
      TableName: `${getTableNames().MASTER_TENANT_DETAILS}`,
      Key: { Id: id },
    });

    return records.Item;
  } catch (error) {
    logger.error(`Error while getting admin details from dynamodb, error: ${error}`);
    throw error;
  }
};

// This is for temporary demo purpose remove afterwards

export const getTenantAwsResourcePrefix = async (tenantId: string) => {
  try {
    const queryCommand: QueryCommandInput = {
      TableName: getTableNames().MASTER_TENANT_DETAILS,
      // ProjectionExpression: 'awsResourcePrefix , connectResourcePrefix',
      KeyConditionExpression: '#id = :id',
      ExpressionAttributeNames: {
        '#id': 'Id',
      },
      ExpressionAttributeValues: {
        ':id': tenantId,
      },
    };

    const records = await getDynamoDBItems(queryCommand);

    return records.Items[0];
  } catch (error) {
    logger.error(`Error while getting admin details from dynamodb, error: ${error}`);
    throw error;
  }
};
