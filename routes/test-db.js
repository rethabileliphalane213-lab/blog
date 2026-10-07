import "dotenv/config";
import pg from "pg";

const { Client } = pg;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    family: 4
});

async function testDatabase() {
    try {
        console.log("Connecting to PostgreSQL...");

        await client.connect();

        console.log("Connected!");

        const result = await client.query(
            'SELECT * FROM "User" WHERE email = $1',
            ["rethabileliphalane213@gmail.com"]
        );

        console.log("RESULT:", result.rows);

    } catch (error) {
        console.log("POSTGRES ERROR:", error);

    } finally {
        await client.end();
    }
}

testDatabase();