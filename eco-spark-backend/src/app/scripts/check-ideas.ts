import prisma from "../lib/prisma.js";

async function check() {
  try {
    const ideas = await prisma.idea.findMany({
      where: { id: { in: ['cmniz02h60001ts5k7x27zuko', 'cmnsn3r2v000004tsvoyyf375'] } }
    });
    console.log('Ideas Statuses:');
    ideas.forEach(i => {
      console.log(`Title: ${i.title}, Status: ${i.status}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

check();
