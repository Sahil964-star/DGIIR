// Role normalization and mapping utility

// Backend Role Enums
export const ROLES = {
  CITIZEN: 'CITIZEN',
  OPERATIONS: 'OPERATIONS',
  FIELD_OFFICER: 'FIELD_OFFICER',
  CHIEF_MINISTER: 'CHIEF_MINISTER',
  DEPARTMENT_HEAD: 'DEPARTMENT_HEAD',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

// Map backend roles to frontend landing pages
export const getRoleLandingPage = (role) => {
  switch (role) {
    case ROLES.CITIZEN:
      return '/citizen';
    case ROLES.OPERATIONS:
      return '/dashboard/operations';
    case ROLES.FIELD_OFFICER:
      return '/dashboard/officer';
    case ROLES.CHIEF_MINISTER:
      return '/dashboard/cm';
    case ROLES.DEPARTMENT_HEAD:
      return '/dashboard/operations'; // Fallback
    case ROLES.SUPER_ADMIN:
      return '/dashboard/admin'; // Fallback
    default:
      return '/login';
  }
};
