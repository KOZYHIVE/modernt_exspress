import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // ✅ Pastikan hanya ada satu instance Prisma
export default prisma; // ✅ Gunakan export default agar bisa diimpor langsung
