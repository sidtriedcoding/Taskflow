import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

async function deleteAllData() {
  // Delete in the reverse order of creation to respect dependencies
  const modelNames = [
    "comment",
    "attachment",
    "taskAssignment",
    "task",
    "projectTeam",
    "user",
    "project",
    "team",
  ];
  for (const modelName of modelNames) {
    // This makes the model name lowercase to match the prisma client properties
    const clientKey = modelName.charAt(0).toLowerCase() + modelName.slice(1);
    const model: any = prisma[clientKey as keyof typeof prisma];
    try {
      if (model && typeof model.deleteMany === "function") {
        await model.deleteMany({});
        console.log(`Cleared data from ${clientKey}`);
      }
    } catch (error) {
      console.error(`Error clearing data from ${clientKey}:`, error);
    }
  }
}

async function main() {
  await deleteAllData();

  const dataDirectory = path.resolve(process.cwd(), "prisma", "seedData");

  // This order is corrected to create dependencies first
  const orderedFileNames = [
    "team.json",
    "project.json",
    "user.json",
    "projectTeam.json",
    "task.json",
    "taskAssignment.json",
    "attachment.json",
    "comment.json",
  ];

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const modelNameRaw = path.basename(fileName, path.extname(fileName));
    const modelName =
      modelNameRaw.charAt(0).toLowerCase() + modelNameRaw.slice(1);
    const model: any = prisma[modelName as keyof typeof prisma];

    if (!model) {
      console.error(
        `Model ${modelName} not found on Prisma client. Skipping ${fileName}.`
      );
      continue;
    }

    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      let jsonData = JSON.parse(fileContent);

      // This corrected logic transforms the data to match the Prisma schema exactly.
      if (modelName === "team") {
        jsonData = jsonData.map((item: any) => {
          // Maps teamName -> teamname and excludes invalid fields
          return {
            id: item.id,
            teamname: item.teamName,
            productOwnerUserId: item.productOwnerUserId,
          };
        });
      }
      if (modelName === "project") {
        jsonData = jsonData.map((item: any) => {
          // Maps name -> teamname
          return {
            id: item.id,
            teamname: item.name,
            description: item.description,
            startDate: item.startDate,
            endDate: item.endDate,
          };
        });
      }

      await model.createMany({
        data: jsonData,
      });
      console.log(`Seeded ${modelName} with data from ${fileName}`);
    } catch (error) {
      console.error(
        `Error seeding data for ${modelName} from ${fileName}:`,
        error
      );
    }
  }

  // Reset SQLite autoincrement sequences after seeding with explicit IDs
  try {
    await prisma.$executeRawUnsafe(
      `UPDATE sqlite_sequence SET seq = (SELECT MAX(id) FROM Team) WHERE name = 'Team'`
    );
    await prisma.$executeRawUnsafe(
      `UPDATE sqlite_sequence SET seq = (SELECT MAX(id) FROM Project) WHERE name = 'Project'`
    );
    await prisma.$executeRawUnsafe(
      `UPDATE sqlite_sequence SET seq = (SELECT MAX(userId) FROM User) WHERE name = 'User'`
    );
    await prisma.$executeRawUnsafe(
      `UPDATE sqlite_sequence SET seq = (SELECT MAX(id) FROM Task) WHERE name = 'Task'`
    );
    console.log("✅ Reset autoincrement sequences for SQLite");
  } catch (error) {
    console.log("⚠️  Could not reset sequences (might be PostgreSQL):", error);
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
