import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  // Вакцин, туулгын дүрэм
  const rules = [
    { type: "vaccine", name: "Галзуугийн вакцин", intervalDays: 365 },
    { type: "vaccine", name: "Нийлмэл вакцин (нохой)", intervalDays: 365 },
    { type: "vaccine", name: "Нийлмэл вакцин (муур)", intervalDays: 365 },
    { type: "deworming", name: "Дотоод туулга", intervalDays: 90 },
    { type: "deworming", name: "Гадаад туулга", intervalDays: 30 },
  ];

  for (const r of rules) {
    const exists = await prisma.vaccineRule.findFirst({ where: { name: r.name } });
    if (!exists) await prisma.vaccineRule.create({ data: r });
  }

  // Админ хэрэглэгч
  const email = process.env.ADMIN_EMAIL!;
  const password = process.env.ADMIN_PASSWORD!;
  const admin = await prisma.user.findUnique({ where: { email } });
  if (!admin) {
    await prisma.user.create({
      data: {
        name: "Админ",
        email,
        passwordHash: await argon2.hash(password),
        role: "admin",
        consentGiven: true,
      },
    });
  }

  console.log("Seed дууслаа");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());