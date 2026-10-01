
import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL || process.env.ONLINE_DB,
});

const prisma = new PrismaClient({
    adapter
});

export default prisma
