import "dotenv/config";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  // Idempotent admin user
  const adminEmail = process.env.ADMIN_EMAIL || "n8ter8@gmail.com";
  const adminPass = process.env.ADMIN_PASSWORD || "ChangeMe_123!";
  const passwordHash = await bcrypt.hash(adminPass, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "OWNER", isActive: true },
    create: {
      email: adminEmail,
      name: "Super Admin",
      role: "OWNER",
      password: passwordHash,
      isActive: true,
    },
  });

  // Minimal seed for subscription tiers (idempotent)
  const tiers = [
    { name: "FREE", displayName: "Free", price: 0, billingPeriod: "MONTHLY" },
    { name: "PROFESSIONAL", displayName: "Professional", price: 99, billingPeriod: "MONTHLY", weatherAlerts: true, gpsTracking: true, geofencing: true, advancedReporting: true, customEstimates: true, apiAccess: false, prioritySupport: true },
  ];

  for (const t of tiers) {
    await prisma.subscriptionTier.upsert({
      where: { name: t.name },
      update: { ...t },
      create: { ...t },
    } as any);
  }

  console.log("Seed complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
