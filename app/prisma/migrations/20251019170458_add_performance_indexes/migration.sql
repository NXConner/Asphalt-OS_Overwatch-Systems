-- Add indexes for better query performance

-- User indexes
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");
CREATE INDEX IF NOT EXISTS "User_isActive_idx" ON "User"("isActive");
CREATE INDEX IF NOT EXISTS "User_createdAt_idx" ON "User"("createdAt");

-- Job indexes
CREATE INDEX IF NOT EXISTS "Job_status_idx" ON "Job"("status");
CREATE INDEX IF NOT EXISTS "Job_createdBy_idx" ON "Job"("createdBy");
CREATE INDEX IF NOT EXISTS "Job_scheduledDate_idx" ON "Job"("scheduledDate");
CREATE INDEX IF NOT EXISTS "Job_createdAt_idx" ON "Job"("createdAt");
CREATE INDEX IF NOT EXISTS "Job_latitude_longitude_idx" ON "Job"("latitude", "longitude");

-- Estimate indexes
CREATE INDEX IF NOT EXISTS "Estimate_jobId_idx" ON "Estimate"("jobId");
CREATE INDEX IF NOT EXISTS "Estimate_status_idx" ON "Estimate"("status");
CREATE INDEX IF NOT EXISTS "Estimate_createdBy_idx" ON "Estimate"("createdBy");
CREATE INDEX IF NOT EXISTS "Estimate_createdAt_idx" ON "Estimate"("createdAt");

-- Expense indexes
CREATE INDEX IF NOT EXISTS "Expense_categoryId_idx" ON "Expense"("categoryId");
CREATE INDEX IF NOT EXISTS "Expense_createdBy_idx" ON "Expense"("createdBy");
CREATE INDEX IF NOT EXISTS "Expense_expenseDate_idx" ON "Expense"("expenseDate");
CREATE INDEX IF NOT EXISTS "Expense_status_idx" ON "Expense"("status");

-- Revenue indexes
CREATE INDEX IF NOT EXISTS "Revenue_jobId_idx" ON "Revenue"("jobId");
CREATE INDEX IF NOT EXISTS "Revenue_createdBy_idx" ON "Revenue"("createdBy");
CREATE INDEX IF NOT EXISTS "Revenue_revenueDate_idx" ON "Revenue"("revenueDate");

-- Timesheet indexes (Already has indexes in schema)
-- CREATE INDEX IF NOT EXISTS "Timesheet_userId_idx" ON "Timesheet"("userId");
-- CREATE INDEX IF NOT EXISTS "Timesheet_jobId_idx" ON "Timesheet"("jobId");

-- Employee Location indexes
CREATE INDEX IF NOT EXISTS "EmployeeLocation_userId_idx" ON "EmployeeLocation"("userId");
CREATE INDEX IF NOT EXISTS "EmployeeLocation_timestamp_idx" ON "EmployeeLocation"("timestamp");

-- Employee Movement indexes
CREATE INDEX IF NOT EXISTS "EmployeeMovement_userId_idx" ON "EmployeeMovement"("userId");
CREATE INDEX IF NOT EXISTS "EmployeeMovement_timestamp_idx" ON "EmployeeMovement"("timestamp");

-- Employee Tracking indexes
CREATE INDEX IF NOT EXISTS "EmployeeTracking_userId_idx" ON "EmployeeTracking"("userId");
CREATE INDEX IF NOT EXISTS "EmployeeTracking_date_idx" ON "EmployeeTracking"("date");

-- Bid indexes
CREATE INDEX IF NOT EXISTS "Bid_status_idx" ON "Bid"("status");
CREATE INDEX IF NOT EXISTS "Bid_createdById_idx" ON "Bid"("createdById");
CREATE INDEX IF NOT EXISTS "Bid_submittedDate_idx" ON "Bid"("submittedDate");
CREATE INDEX IF NOT EXISTS "Bid_createdAt_idx" ON "Bid"("createdAt");

-- Clock Record indexes (Already has indexes in schema)
-- CREATE INDEX IF NOT EXISTS "ClockRecord_userId_idx" ON "ClockRecord"("userId");
-- CREATE INDEX IF NOT EXISTS "ClockRecord_clockInTime_idx" ON "ClockRecord"("clockInTime");

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS "Expense_categoryId_expenseDate_idx" ON "Expense"("categoryId", "expenseDate");
CREATE INDEX IF NOT EXISTS "Revenue_jobId_revenueDate_idx" ON "Revenue"("jobId", "revenueDate");
