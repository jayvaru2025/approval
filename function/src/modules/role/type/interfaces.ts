export interface Permission {
  id: string;
  key: string;
  name: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}
