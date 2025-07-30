import { DescribeTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  BatchWriteCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  ScanCommandInput,
  UpdateCommand,
  QueryCommand,
  QueryCommandInput,
  GetCommandInput,
  GetCommand,
  TranslateConfig,
} from '@aws-sdk/lib-dynamodb';
import { getConfig } from '../../utils/config';
import { customLogger } from '../../utils/logger';

const logger = customLogger('DynamoDB::service');

export const dynamoClient = (config: TranslateConfig = {}) => {
  const {
    AWS: { REGION: region },
  } = getConfig();
  const client = new DynamoDBClient({ region });
  const dynamo = DynamoDBDocumentClient.from(client, { ...config });
  return dynamo;
};

export const getDynamoDBItems = async (queryCommand: QueryCommandInput) => {
  try {
    const dynamo = dynamoClient();
    const response = await dynamo.send(new QueryCommand(queryCommand));
    return response;
  } catch (error) {
    logger.error(`Error while querying DynamoDB: ${error.message}`);
    throw error;
  }
};

export const getDynamoDBItem = async (getCommand: GetCommandInput) => {
  try {
    const dynamo = dynamoClient();
    const response = await dynamo.send(new GetCommand(getCommand));
    return response;
  } catch (error) {
    logger.error(`Error querying DynamoDB: ${error.message}`);
    throw error;
  }
};

export const getDynamoDBAllItems = async (scanCommand: ScanCommandInput) => {
  try {
    const dynamo = dynamoClient();
    const response = await dynamo.send(new ScanCommand(scanCommand));
    return response;
  } catch (error) {
    logger.error(`Error while getting all items from dynamodb, error: ${error}`);
    throw error;
  }
};

export const addDynamoDBItem = async (tableName: string, dynamoItem: any) => {
  try {
    const dynamo = dynamoClient({
      marshallOptions: {
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
      },
    });

    await dynamo.send(new PutCommand({ TableName: tableName, Item: dynamoItem }));
  } catch (error) {
    logger.error(`Error while adding item to dynamodb, error: ${error}`);
    throw error;
  }
};

export const removeDynamoDBItem = async (tableName: string, dynamoItemKey: Record<string, any>) => {
  try {
    const dynamo = dynamoClient();
    await dynamo.send(new DeleteCommand({ TableName: tableName, Key: dynamoItemKey }));
  } catch (error) {
    logger.error(`Error while removing item from dynamodb, error: ${error}`);
    throw error;
  }
};

export const updateDynamoDBItemById = async (
  tableName: string,
  itemId: string,
  attributesToUpdate: Record<string, any>,
) => {
  try {
    const dynamo = dynamoClient({
      marshallOptions: {
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
      },
    });

    // Build the update expression and expression attribute values
    const updateExpressionParts = [];
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};

    for (const key of Object.keys(attributesToUpdate)) {
      const attributeKey = `#${key}`;
      const valueKey = `:${key}`;
      updateExpressionParts.push(`${attributeKey} = ${valueKey}`);
      expressionAttributeValues[valueKey] = attributesToUpdate[key];
      expressionAttributeNames[attributeKey] = key;
    }

    const updateExpression = `SET ${updateExpressionParts.join(', ')}`;

    // Condition expression to ensure the item exists
    const conditionExpression = 'attribute_exists(id)'; // Ensures item with the given id exists

    await dynamo.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { id: itemId }, // Adjust the key attribute name to match your table's primary key
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
        ConditionExpression: conditionExpression, // Ensure item exists before updating
      }),
    );

    logger.info(`Item with ID ${itemId} updated successfully in table ${tableName}`);
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      // Item does not exist, so no update occurred
      logger.warn(`Item with ID ${itemId} does not exist. No update was performed.`);
    } else {
      logger.error(`Error while updating item in DynamoDB, error: ${error}`);
      throw error;
    }
  }
};

export const putDynamoDBItem = async (tableName: string, item: Record<string, any>) => {
  try {
    const dynamo = dynamoClient({
      marshallOptions: {
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
      },
    });

    await dynamo.send(
      new PutCommand({
        TableName: tableName,
        Item: item,
      }),
    );

    logger.info(`Item with ID ${item.id} put successfully in table ${tableName}`);
  } catch (error) {
    logger.error(`Error while putting item in DynamoDB, error: ${error}`);
    throw error;
  }
};
