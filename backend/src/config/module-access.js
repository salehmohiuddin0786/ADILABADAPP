/**
 * ADILABAD APP — MODULE ACCESS POLICY
 * Controls which roles can access and operate on specific modules.
 */

const { ROLES } = require('./roles');

const MODULES = Object.freeze({
  ADVERTISEMENTS: 'advertisements',
  BUSINESSES: 'businesses',
  EVENTS: 'events',
  OFFERS: 'offers',
  RENTALS: 'rentals',
  BUY_SELL: 'buy_sell',
  SERVICES: 'services',
  JOBS: 'jobs',
  COMMUNITY: 'community',
  FOOD: 'food',
  DESTINATIONS: 'destinations',
  PROPERTIES: 'properties',
  EDUCATION: 'education',
  AGRICULTURE: 'agriculture',
  WEDDINGS: 'weddings',
  NOTIFICATIONS: 'notifications',
  REPORTS: 'reports'
});

const MODULE_CAPABILITIES = Object.freeze({
  [MODULES.RENTALS]: {
    canList: [ROLES.INDIVIDUAL_OWNER, ROLES.BUSINESS_OWNER, ROLES.SUPER_ADMIN],
    canBook: [ROLES.CUSTOMER, ROLES.INDIVIDUAL_OWNER, ROLES.BUSINESS_OWNER, ROLES.SUPER_ADMIN],
    requiresApproval: true,
    requiresVerification: true
  },
  [MODULES.BUY_SELL]: {
    canList: [ROLES.CUSTOMER, ROLES.INDIVIDUAL_OWNER, ROLES.BUSINESS_OWNER, ROLES.SUPER_ADMIN],
    requiresApproval: true,
    requiresVerification: false
  },
  [MODULES.SERVICES]: {
    canList: [ROLES.SERVICE_PROVIDER, ROLES.BUSINESS_OWNER, ROLES.SUPER_ADMIN],
    requiresApproval: true,
    requiresVerification: true
  },
  [MODULES.JOBS]: {
    canList: [ROLES.EMPLOYER, ROLES.BUSINESS_OWNER, ROLES.SUPER_ADMIN],
    requiresApproval: true,
    requiresVerification: true
  },
  [MODULES.PROPERTIES]: {
    canList: [ROLES.PROPERTY_OWNER, ROLES.BUSINESS_OWNER, ROLES.SUPER_ADMIN],
    requiresApproval: true,
    requiresVerification: true
  },
  [MODULES.ADVERTISEMENTS]: {
    canList: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.BUSINESS_OWNER],
    requiresApproval: true,
    requiresVerification: true
  },
  [MODULES.BUSINESSES]: {
    canList: [ROLES.BUSINESS_OWNER, ROLES.SUPER_ADMIN, ROLES.ADMIN],
    requiresApproval: true,
    requiresVerification: true
  }
});

module.exports = {
  MODULES,
  MODULE_CAPABILITIES
};
