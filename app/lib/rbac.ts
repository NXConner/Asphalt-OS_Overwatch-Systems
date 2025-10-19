
/**
 * Role-Based Access Control (RBAC) System
 * Manages permissions and access control for different user roles
 */

export enum Permission {
  // User Management
  VIEW_USERS = 'view_users',
  CREATE_USERS = 'create_users',
  EDIT_USERS = 'edit_users',
  DELETE_USERS = 'delete_users',
  MANAGE_ROLES = 'manage_roles',
  
  // Job Management
  VIEW_JOBS = 'view_jobs',
  CREATE_JOBS = 'create_jobs',
  EDIT_JOBS = 'edit_jobs',
  DELETE_JOBS = 'delete_jobs',
  VIEW_ALL_JOBS = 'view_all_jobs',
  VIEW_OWN_JOBS = 'view_own_jobs',
  
  // Financial
  VIEW_FINANCES = 'view_finances',
  MANAGE_FINANCES = 'manage_finances',
  VIEW_PAYROLL = 'view_payroll',
  MANAGE_PAYROLL = 'manage_payroll',
  VIEW_EXPENSES = 'view_expenses',
  APPROVE_EXPENSES = 'approve_expenses',
  
  // Estimates & Bids
  VIEW_ESTIMATES = 'view_estimates',
  CREATE_ESTIMATES = 'create_estimates',
  EDIT_ESTIMATES = 'edit_estimates',
  APPROVE_ESTIMATES = 'approve_estimates',
  
  // Invoices
  VIEW_INVOICES = 'view_invoices',
  CREATE_INVOICES = 'create_invoices',
  EDIT_INVOICES = 'edit_invoices',
  DELETE_INVOICES = 'delete_invoices',
  
  // Clients (only CLIENT role can view their own data)
  VIEW_CLIENTS = 'view_clients',
  MANAGE_CLIENTS = 'manage_clients',
  VIEW_OWN_CLIENT_DATA = 'view_own_client_data',
  
  // Employee Tracking
  VIEW_TRACKING = 'view_tracking',
  VIEW_ALL_TRACKING = 'view_all_tracking',
  VIEW_OWN_TRACKING = 'view_own_tracking',
  MANAGE_TRACKING = 'manage_tracking',
  
  // Reports
  VIEW_REPORTS = 'view_reports',
  VIEW_ADVANCED_REPORTS = 'view_advanced_reports',
  EXPORT_REPORTS = 'export_reports',
  
  // Settings
  VIEW_SETTINGS = 'view_settings',
  MANAGE_SETTINGS = 'manage_settings',
  MANAGE_BUSINESS_SETTINGS = 'manage_business_settings',
  
  // Equipment
  VIEW_EQUIPMENT = 'view_equipment',
  MANAGE_EQUIPMENT = 'manage_equipment',
  CHECKOUT_EQUIPMENT = 'checkout_equipment',
  
  // Fleet
  VIEW_FLEET = 'view_fleet',
  MANAGE_FLEET = 'manage_fleet',
  
  // Documents
  VIEW_DOCUMENTS = 'view_documents',
  UPLOAD_DOCUMENTS = 'upload_documents',
  DELETE_DOCUMENTS = 'delete_documents',
  
  // Training
  VIEW_TRAINING = 'view_training',
  MANAGE_TRAINING = 'manage_training',
  ASSIGN_TRAINING = 'assign_training',
  
  // Performance
  VIEW_PERFORMANCE = 'view_performance',
  VIEW_OWN_PERFORMANCE = 'view_own_performance',
  MANAGE_PERFORMANCE = 'manage_performance',
  
  // Communication
  SEND_MESSAGES = 'send_messages',
  VIEW_MESSAGES = 'view_messages',
  SEND_ANNOUNCEMENTS = 'send_announcements',
  
  // AI Features
  USE_AI_CHATBOT = 'use_ai_chatbot',
  USE_AI_SURFACE_DETECTION = 'use_ai_surface_detection',
  TRAIN_AI = 'train_ai',
  
  // Map Features
  USE_MAP = 'use_map',
  EDIT_MAP_MEASUREMENTS = 'edit_map_measurements',
  VIEW_ALL_MAP_DATA = 'view_all_map_data',
}

export type UserRole = 'OWNER' | 'ADMIN' | 'EMPLOYEE' | 'CLIENT';

// Role permission mappings
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // OWNER - Full system access
  OWNER: Object.values(Permission),
  
  // ADMIN - Most permissions except critical business settings
  ADMIN: [
    // Users
    Permission.VIEW_USERS,
    Permission.CREATE_USERS,
    Permission.EDIT_USERS,
    
    // Jobs
    Permission.VIEW_JOBS,
    Permission.CREATE_JOBS,
    Permission.EDIT_JOBS,
    Permission.DELETE_JOBS,
    Permission.VIEW_ALL_JOBS,
    
    // Financial
    Permission.VIEW_FINANCES,
    Permission.MANAGE_FINANCES,
    Permission.VIEW_PAYROLL,
    Permission.MANAGE_PAYROLL,
    Permission.VIEW_EXPENSES,
    Permission.APPROVE_EXPENSES,
    
    // Estimates & Bids
    Permission.VIEW_ESTIMATES,
    Permission.CREATE_ESTIMATES,
    Permission.EDIT_ESTIMATES,
    Permission.APPROVE_ESTIMATES,
    
    // Invoices
    Permission.VIEW_INVOICES,
    Permission.CREATE_INVOICES,
    Permission.EDIT_INVOICES,
    Permission.DELETE_INVOICES,
    
    // Clients
    Permission.VIEW_CLIENTS,
    Permission.MANAGE_CLIENTS,
    
    // Tracking
    Permission.VIEW_TRACKING,
    Permission.VIEW_ALL_TRACKING,
    Permission.MANAGE_TRACKING,
    
    // Reports
    Permission.VIEW_REPORTS,
    Permission.VIEW_ADVANCED_REPORTS,
    Permission.EXPORT_REPORTS,
    
    // Settings
    Permission.VIEW_SETTINGS,
    Permission.MANAGE_SETTINGS,
    
    // Equipment & Fleet
    Permission.VIEW_EQUIPMENT,
    Permission.MANAGE_EQUIPMENT,
    Permission.VIEW_FLEET,
    Permission.MANAGE_FLEET,
    
    // Documents
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
    Permission.DELETE_DOCUMENTS,
    
    // Training
    Permission.VIEW_TRAINING,
    Permission.MANAGE_TRAINING,
    Permission.ASSIGN_TRAINING,
    
    // Performance
    Permission.VIEW_PERFORMANCE,
    Permission.MANAGE_PERFORMANCE,
    
    // Communication
    Permission.SEND_MESSAGES,
    Permission.VIEW_MESSAGES,
    Permission.SEND_ANNOUNCEMENTS,
    
    // AI
    Permission.USE_AI_CHATBOT,
    Permission.USE_AI_SURFACE_DETECTION,
    
    // Map
    Permission.USE_MAP,
    Permission.EDIT_MAP_MEASUREMENTS,
    Permission.VIEW_ALL_MAP_DATA,
  ],
  
  // EMPLOYEE - Limited access to relevant work features
  EMPLOYEE: [
    // Jobs (view only assigned)
    Permission.VIEW_JOBS,
    Permission.VIEW_OWN_JOBS,
    
    // Financial (view own)
    Permission.VIEW_EXPENSES,
    
    // Tracking (view own)
    Permission.VIEW_TRACKING,
    Permission.VIEW_OWN_TRACKING,
    
    // Equipment
    Permission.VIEW_EQUIPMENT,
    Permission.CHECKOUT_EQUIPMENT,
    
    // Documents (view only)
    Permission.VIEW_DOCUMENTS,
    
    // Training
    Permission.VIEW_TRAINING,
    
    // Performance (view own)
    Permission.VIEW_OWN_PERFORMANCE,
    
    // Communication
    Permission.SEND_MESSAGES,
    Permission.VIEW_MESSAGES,
    
    // AI
    Permission.USE_AI_CHATBOT,
    
    // Map (basic use)
    Permission.USE_MAP,
  ],
  
  // CLIENT - Very limited access to their own data only
  CLIENT: [
    // View own jobs
    Permission.VIEW_OWN_JOBS,
    
    // View own estimates
    Permission.VIEW_ESTIMATES,
    
    // View own invoices
    Permission.VIEW_INVOICES,
    
    // View own client data
    Permission.VIEW_OWN_CLIENT_DATA,
    
    // Communication
    Permission.SEND_MESSAGES,
    Permission.VIEW_MESSAGES,
    
    // AI (basic)
    Permission.USE_AI_CHATBOT,
  ],
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Middleware helper to check permissions
 */
export function requirePermission(role: UserRole, permission: Permission): boolean {
  if (!hasPermission(role, permission)) {
    return false;
  }
  return true;
}

/**
 * Get user-friendly role name
 */
export function getRoleName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    OWNER: 'Owner / Super Admin',
    ADMIN: 'Administrator',
    EMPLOYEE: 'Employee',
    CLIENT: 'Client',
  };
  return roleNames[role] || role;
}

/**
 * Get role description
 */
export function getRoleDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    OWNER: 'Full system access - can manage all aspects of the business',
    ADMIN: 'Administrative access - can manage most features except critical business settings',
    EMPLOYEE: 'Limited access - can view assigned jobs, track time, and use basic features',
    CLIENT: 'Client access - can view their own jobs, estimates, and invoices',
  };
  return descriptions[role] || '';
}
