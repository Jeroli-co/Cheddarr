export enum Roles {
  NONE,
  ADMIN = 2,
  REQUEST = 4,
  MANAGE_SETTINGS = 8,
  MANAGE_REQUEST = 16,
  MANAGE_USERS = 32,
  AUTO_APPROVE = 64,
}

export const getRoleLabel = (role: Roles): string => {
  switch (role) {
    case Roles.NONE:
      return 'None'
    case Roles.ADMIN:
      return 'Admin'
    case Roles.REQUEST:
      return 'Request'
    case Roles.MANAGE_SETTINGS:
      return 'Manage Settings'
    case Roles.MANAGE_REQUEST:
      return 'Manage Request'
    case Roles.MANAGE_USERS:
      return 'Manage Users'
    case Roles.AUTO_APPROVE:
      return 'Auto Approve'
    default:
      return 'Unknown'
  }
}
