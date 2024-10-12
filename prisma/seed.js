const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
  try {
    console.log("Roles creation started");
    const roles = [{ nom: "DENTIST" }, { nom: "ADMIN" }, { nom: "ASSISTANT" }];

    for (let role of roles) {
      await prisma.role.upsert({
        where: { nom: role.nom },
        update: {},
        create: { nom: role.nom },
      });
      console.log(`Role ${role.nom} seeded successfully`);
    }

    console.log("All Roles seeded successfully...");

    console.log("Admin user creation started...");

    // Create ADMIN user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    const adminRoles = ["ADMIN", "ASSISTANT"];

    const user = await prisma.utilisateur.create({
      data: {
        nom: process.env.ADMIN_NOM,
        prenom: process.env.ADMIN_PRENOM,
        email: process.env.ADMIN_EMAIL,
        motDePasse: hashedPassword,
        roles: { connect: adminRoles.map((role) => ({ nom: role })) },
      },
      include: { roles: true },
    });
    console.log("ADMIN user created successfully:");
  } catch (error) {
    console.error("Error creating seed:", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
