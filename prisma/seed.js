const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const roles = [{ nom: "DENTIST" }, { nom: "ADMIN" }, { nom: "ASSISTANT" }];

  for (let role of roles) {
    await prisma.role.upsert({
      where: { nom: role.nom },
      update: {},
      create: { nom: role.nom },
    });
    console.log(`Role ${role.nom} seeded successfully`);
  }

  console.log("All Roles seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
