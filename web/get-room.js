const { PrismaClient } = require('./src/generated/prisma-client'); 
const prisma = new PrismaClient(); 
prisma.room.findFirst()
  .then(r => console.log(r ? r.id : 'No rooms'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
