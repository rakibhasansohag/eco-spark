import "dotenv/config";
import { auth } from "../lib/auth.js";
import prisma from "../lib/prisma.js";
import { Role } from "../../generated/prisma/index.js";

const DEFAULT_CATEGORIES = [
  { name: "Energy", slug: "energy" },
  { name: "Waste", slug: "waste" },
  { name: "Transportation", slug: "transportation" },
  { name: "Water", slug: "water" },
  { name: "Agriculture", slug: "agriculture" },
  { name: "Technology", slug: "technology" },
];

async function seed() {
  console.info("Starting seed...");

  // Admin user
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@ecosparkHub.com" },
  });

  if (!existingAdmin) {
    const result = await auth.api.signUpEmail({
      body: {
        name: "EcoSpark Admin",
        email: "admin@ecosparkHub.com",
        password: "Admin@1234",
      },
    });
    if (result?.user) {
      await prisma.user.update({
        where: { id: result.user.id },
        data: { role: Role.ADMIN },
      });
      console.info("Admin user created: admin@ecosparkHub.com / Admin@1234");
    }
  } else {
    if (existingAdmin.role !== Role.ADMIN) {
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: { role: Role.ADMIN },
      });
      console.info("Admin role corrected for existing admin user");
    }
    console.info("Admin user already exists");
  }

  // Sample member
  const existingMember = await prisma.user.findUnique({
    where: { email: "member@ecosparkHub.com" },
  });

  if (!existingMember) {
    await auth.api.signUpEmail({
      body: {
        name: "Sample Member",
        email: "member@ecosparkHub.com",
        password: "Member@1234",
      },
    });
    console.info("Sample member created: member@ecosparkHub.com / Member@1234");
  }

  // Default categories
  for (const cat of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.info(`Seeded ${DEFAULT_CATEGORIES.length} categories`);

  console.info("Seed complete.");
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
