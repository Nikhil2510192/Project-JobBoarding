<<<<<<< HEAD
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient({
  log: ["query"],
});

export default prisma;
=======
// db.config.js (or prismaClient.js)

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query"], // optional
});

export default prisma;
>>>>>>> frontendv1
