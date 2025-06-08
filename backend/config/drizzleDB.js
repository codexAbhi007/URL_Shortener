import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
console.log(`Drizzle Connected`)
export const db = drizzle(process.env.DATABASE_URL);
