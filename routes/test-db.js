import prisma from "./db.js";

async function testDatabase() {
    try {
        const users = await prisma.user.findMany();

        console.log("DATABASE CONNECTION WORKS");
        console.log(users);

    } catch (error) {
        console.error("DATABASE ERROR:");
        console.error(error);

    } finally {
        await prisma.$disconnect();
    }
}

testDatabase();