
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({
    adapter
});

export default prisma



signinRouter.js

import {Router} from "express"

import bcrypt from "bcryptjs"

const signinRouter=Router()
import prisma from "./db.js"
