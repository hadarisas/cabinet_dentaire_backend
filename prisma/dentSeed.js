const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const dentPositions = [
  { code: 1, position: "Upper Right Third Molar" },
  { code: 2, position: "Upper Right Second Molar" },
  { code: 3, position: "Upper Right First Molar" },
  { code: 4, position: "Upper Right Second Premolar" },
  { code: 5, position: "Upper Right First Premolar" },
  { code: 6, position: "Upper Right Canine (Cuspid)" },
  { code: 7, position: "Upper Right Lateral Incisor" },
  { code: 8, position: "Upper Right Central Incisor" },
  { code: 9, position: "Upper Left Central Incisor" },
  { code: 10, position: "Upper Left Lateral Incisor" },
  { code: 11, position: "Upper Left Canine (Cuspid)" },
  { code: 12, position: "Upper Left First Premolar" },
  { code: 13, position: "Upper Left Second Premolar" },
  { code: 14, position: "Upper Left First Molar" },
  { code: 15, position: "Upper Left Second Molar" },
  { code: 16, position: "Upper Left Third Molar" },
  { code: 17, position: "Lower Left Third Molar" },
  { code: 18, position: "Lower Left Second Molar" },
  { code: 19, position: "Lower Left First Molar" },
  { code: 20, position: "Lower Left Second Premolar" },
  { code: 21, position: "Lower Left First Premolar" },
  { code: 22, position: "Lower Left Canine (Cuspid)" },
  { code: 23, position: "Lower Left Lateral Incisor" },
  { code: 24, position: "Lower Left Central Incisor" },
  { code: 25, position: "Lower Right Central Incisor" },
  { code: 26, position: "Lower Right Lateral Incisor" },
  { code: 27, position: "Lower Right Canine (Cuspid)" },
  { code: 28, position: "Lower Right First Premolar" },
  { code: 29, position: "Lower Right Second Premolar" },
  { code: 30, position: "Lower Right First Molar" },
  { code: 31, position: "Lower Right Second Molar" },
  { code: 32, position: "Lower Right Third Molar" },
];

async function seedDents() {
  console.log("Start seeding Dents...");
  for (const dent of dentPositions) {
    try {
      await prisma.dent.upsert({
        where: { code: dent.code },
        update: {},
        create: {
          code: dent.code,
          position: dent.position,
        },
      });
      console.log(`Created dent with code: ${dent.code}`);
    } catch (error) {
      console.error(`Error creating dent with code ${dent.code}:`, error);
    }
  }
  console.log("Seeding Dents completed.");
}

seedDents()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
