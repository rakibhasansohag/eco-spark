const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const watchlists = await prisma.watchlist.findMany({
    include: { user: true, idea: true }
  });
  console.log('Total Watchlist Records:', watchlists.length);
  watchlists.forEach(w => {
    console.log(`User: ${w.user.email}, Idea: ${w.idea.title}`);
  });
  process.exit(0);
}

check();
