import global from '../../utils/global';
export const getTableNames = (prefix?: string) => {
  const connectResourcePrefix = global.getConnectResourcePrefix(prefix);

  return {
    USER_DETAILS: `-dydb-admin-user-${process.env.REGION_PREFIX}-${process.env.ENV}-${connectResourcePrefix}`,
    MASTER_TENANT_DETAILS: process.env.MASTER_TENANT_DETAILS,
    CONNECT_RESOURCE: `-dydb-connect-resource-${process.env.REGION_PREFIX}-${process.env.ENV}-${connectResourcePrefix}`,
    ROLE_PERMISSION_MAPPING_DETAILS: `-dydb-role-mappings-${process.env.REGION_PREFIX}-${process.env.ENV}-${connectResourcePrefix}`,
    TECHNICIAN_LOCATION_TRACKING: `-dydb-location-tracking-${process.env.REGION_PREFIX}-${process.env.ENV}-${connectResourcePrefix}`,
  };
};

export enum ResponseStatus {
  FAIL = 'fail',
  SUCCESS = 'success',
}
``;
