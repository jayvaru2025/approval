import { CountryCode } from 'libphonenumber-js';

declare module 'express-serve-static-core' {
  interface Request {
    tenantId?: string;
    awsResourcePrefix?: string;
  }
}

export interface Address {
  id: string;
  address: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  state: string;
  country: string;
  type: string;
  default: boolean;
  coordinates: {
    lat: string;
    long: string;
  };
}

export interface CustomerDetail {
  id: string;
  address: Address[];
  dateOfBirth: string;
  driversLicense: string;
  email: string;
  searchUserName: string;
  experience: number;
  firstName: string;
  gender: string;
  idNumber: string;
  lastName: string;
  licenseClass: string;
  password: string;
  phoneNumber: string;
  countryCode?: CountryCode;
  dialCode?: string;
  tenantId: string;
  userName: string;
  userType: string;
  temporaryPassword: string;
  allowTemporaryPassword: boolean;
  mailPassword?: string;
  sortByNameAndPhoneNumber?: string;
}

export interface TechnicianDetail extends CustomerDetail {
  serviceName: string;
  searchUserName: string;
  totalAppointmentServed: number;
  averageRating: number;
  agentConnectId: string;
  agentConnectArn: string;
}
export type FavouriteCustomersType = {
  id: string;
};
