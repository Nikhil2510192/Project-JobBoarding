// db.config.js (or prismaClient.js)

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query"], // optional
});

export default prisma;
