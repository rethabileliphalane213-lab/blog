import "dotenv/config";
import pg from "pg";

const { Client } = pg;

const client = new Client({
    connectionString: process.env.DATABASE_URL_UNPOOLED
});

try {
    await client.connect();

    console.log("PG CONNECTION WORKS");

    const result = await client.query("SELECT NOW()");

    console.log(result.rows);

} catch (error) {
    console.error("PG ERROR:");
    console.error(error);

} finally {
    await client.end();
}