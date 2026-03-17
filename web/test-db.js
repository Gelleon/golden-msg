const { PrismaClient } = require('./src/generated/prisma-client'); 
const prisma = new PrismaClient(); 
prisma.room.findFirst().then(r => console.log('ROOM_ID:', r?.id)).finally(() => prisma.$disconnect());