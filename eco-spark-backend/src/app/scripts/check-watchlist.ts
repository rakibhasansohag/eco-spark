import prisma from "../lib/prisma.js";

async function check() {
  try {
    const watchlists = await prisma.watchlist.findMany({
      include: { user: true, idea: true }
    });
    console.log('Total Watchlist Records:', watchlists.length);
    watchlists.forEach(w => {
      console.log(`User: ${w.user.email} (ID: ${w.user.id}), Idea: ${w.idea.title} (ID: ${w.idea.id})`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

check();
