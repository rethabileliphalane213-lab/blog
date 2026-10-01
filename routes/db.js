
import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
console.log("ONLINE DB URL:", process.env.ONLINE_DB);
const adapter = new PrismaPg({
    connectionString:  process.env.ONLINE_DB,
});

const prisma = new PrismaClient({
    adapter
});

export default prisma
