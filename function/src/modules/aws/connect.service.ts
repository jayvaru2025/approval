import {
  ConnectClient,
  CreateUserCommand,
  CreateUserCommandInput,
  DeleteUserCommand,
  DeleteUserCommandInput,
  GetCurrentUserDataCommand,
  GetCurrentUserDataCommandInput,
  ListAgentStatusesCommand,
  ListAgentStatusesCommandInput,
  PutUserStatusCommand,
  PutUserStatusCommandInput,
  UpdateUserIdentityInfoCommand,
  UpdateUserIdentityInfoCommandInput,
} from '@aws-sdk/client-connect';
import { customLogger } from '../../utils/logger';

const logger = customLogger('Connect::service');

const client = new ConnectClient({
  region: 'us-east-1',
});

export const createConnectUser = async (createUserInput: CreateUserCommandInput) => {
  try {
    const command = new CreateUserCommand(createUserInput);
    const response = await client.send(command);
    return response;
  } catch (error) {
    logger.error(`Error while creating user in connect, error: ${error}`);
    throw error;
  }
};

export const getAgentStatus = async (inputCommand: GetCurrentUserDataCommandInput) => {
  try {
    const command = new GetCurrentUserDataCommand(inputCommand);
    const response = await client.send(command);
    return response;
  } catch (error) {
    logger.error(`Error while fetching technician status in connect, error: ${error}`);
    throw error;
  }
};
export const listAgentStatus = async (inputCommand: ListAgentStatusesCommandInput) => {
  try {
    const command = new ListAgentStatusesCommand(inputCommand);
    const response = await client.send(command);
    return response;
  } catch (error) {
    logger.error(`Error while listing technician status in connect, error: ${error}`);
    throw error;
  }
};
export const updateAgentStatus = async (inputCommand: PutUserStatusCommandInput) => {
  try {
    const command = new PutUserStatusCommand(inputCommand);
    const response = await client.send(command);
    return response;
  } catch (error) {
    logger.error(`Error while updating technician status in connect, error: ${error}`);
    throw error;
  }
};

export const deleteConnectUser = async (deleteUserInput: DeleteUserCommandInput) => {
  try {
    const command = new DeleteUserCommand(deleteUserInput);
    const response = await client.send(command);
    return response;
  } catch (error) {
    logger.error(`Error while deleting user in connect, error: ${error}`);
    throw error;
  }
};

export const updateConnectUser = async (updateUserInput: UpdateUserIdentityInfoCommandInput) => {
  try {
    const command = new UpdateUserIdentityInfoCommand(updateUserInput);
    const response = await client.send(command);
    return response;
  } catch (error) {
    logger.error(`Error while updating user in connect, error: ${error}`);
    throw error;
  }
};
