
/**
 * Audit Logging System
 * Tracks all important actions for security and compliance
 */

import { prisma } from './db';

export enum AuditAction {
  // Authentication
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  
  // CRUD Operations
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  
  // Business Operations
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  SUBMIT = 'SUBMIT',
  CANCEL = 'CANCEL',
  
  // File Operations
  UPLOAD = 'UPLOAD',
  DOWNLOAD = 'DOWNLOAD',
  
  // Admin Operations
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
  ROLE_CHANGE = 'ROLE_CHANGE',
  SETTINGS_CHANGE = 'SETTINGS_CHANGE',
}

export enum AuditResource {
  USER = 'User',
  JOB = 'Job',
  CLIENT = 'Client',
  ESTIMATE = 'Estimate',
  INVOICE = 'Invoice',
  EXPENSE = 'Expense',
  EMPLOYEE = 'Employee',
  VEHICLE = 'Vehicle',
  EQUIPMENT = 'Equipment',
  TIMESHEET = 'Timesheet',
  PAYROLL = 'Payroll',
  MATERIAL = 'Material',
  DOCUMENT = 'Document',
  SETTINGS = 'Settings',
}

interface AuditLogParams {
  userId: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  success?: boolean;
  error?: string;
}

/**
 * Log an audit event
 */
export async function logAudit(params: AuditLogParams) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        metadata: params.metadata ? JSON.stringify(params.metadata) : undefined,
        success: params.success ?? true,
        error: params.error,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    // Fail silently to not disrupt main operation
    console.error('Failed to log audit event:', error);
  }
}

/**
 * Helper to extract request metadata
 */
export function getRequestMetadata(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return { ip, userAgent };
}

/**
 * Log authentication events
 */
export async function logAuth(params: {
  userId: string;
  action: 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED';
  request: Request;
  success?: boolean;
  error?: string;
}) {
  const { ip, userAgent } = getRequestMetadata(params.request);
  
  await logAudit({
    userId: params.userId,
    action: AuditAction[params.action],
    resource: AuditResource.USER,
    ipAddress: ip,
    userAgent,
    success: params.success,
    error: params.error,
  });
}

/**
 * Log CRUD operations
 */
export async function logCRUD(params: {
  userId: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  resource: AuditResource;
  resourceId?: string;
  request: Request;
  metadata?: Record<string, any>;
}) {
  const { ip, userAgent } = getRequestMetadata(params.request);
  
  await logAudit({
    userId: params.userId,
    action: AuditAction[params.action],
    resource: params.resource,
    resourceId: params.resourceId,
    ipAddress: ip,
    userAgent,
    metadata: params.metadata,
  });
}

/**
 * Log business operations
 */
export async function logBusinessOperation(params: {
  userId: string;
  action: 'APPROVE' | 'REJECT' | 'SUBMIT' | 'CANCEL';
  resource: AuditResource;
  resourceId: string;
  request: Request;
  metadata?: Record<string, any>;
}) {
  const { ip, userAgent } = getRequestMetadata(params.request);
  
  await logAudit({
    userId: params.userId,
    action: AuditAction[params.action],
    resource: params.resource,
    resourceId: params.resourceId,
    ipAddress: ip,
    userAgent,
    metadata: params.metadata,
  });
}

/**
 * Get audit logs for a user
 */
export async function getUserAuditLogs(userId: string, limit = 50) {
  return prisma.auditLog.findMany({
    where: { userId },
    orderBy: { timestamp: 'desc' },
    take: limit,
  });
}

/**
 * Get audit logs for a resource
 */
export async function getResourceAuditLogs(
  resource: AuditResource,
  resourceId: string,
  limit = 50
) {
  return prisma.auditLog.findMany({
    where: {
      resource,
      resourceId,
    },
    orderBy: { timestamp: 'desc' },
    take: limit,
  });
}

/**
 * Get recent failed login attempts
 */
export async function getFailedLoginAttempts(minutes = 15) {
  const since = new Date(Date.now() - minutes * 60 * 1000);
  
  return prisma.auditLog.findMany({
    where: {
      action: AuditAction.LOGIN_FAILED,
      timestamp: { gte: since },
    },
    orderBy: { timestamp: 'desc' },
  });
}

/**
 * Get audit statistics
 */
export async function getAuditStats(startDate?: Date, endDate?: Date) {
  const where = startDate && endDate 
    ? { timestamp: { gte: startDate, lte: endDate } }
    : {};
    
  const [total, byAction, byResource, failures] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.groupBy({
      by: ['action'],
      where,
      _count: true,
    }),
    prisma.auditLog.groupBy({
      by: ['resource'],
      where,
      _count: true,
    }),
    prisma.auditLog.count({
      where: { ...where, success: false },
    }),
  ]);
  
  return {
    total,
    byAction,
    byResource,
    failures,
  };
}

