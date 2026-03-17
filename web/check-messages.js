const { PrismaClient } = require('./src/generated/prisma-client');

const prisma = new PrismaClient();

async function main() {
  const messages = await prisma.message.findMany({
    where: { room_id: '7a072292-f72e-4684-989b-ddecafafc719' },
    orderBy: { created_at: 'desc' },
    take: 5
  });
  console.log(messages.map(m => ({
    id: m.id,
    content: m.content,
    translation_status: m.translation_status,
    content_translated: m.content_translated
  })));
}

main().finally(() => prisma.$disconnect());
