import { IdeaService } from "../module/idea/idea.service.js";
import prisma from "../lib/prisma.js";

/**
 * Starts a background interval to automatically generate AI ideas
 * every 24 hours. It uses the first available admin user as the author.
 */
export const startIdeaAutomationScheduler = async () => {
  console.info("Scheduler: Initializing AI Idea Automation (24h interval)...");

  // Define the task
  const runAutomation = async () => {
    try {
      console.info("Scheduler: Running monthly/daily AI idea generation batch...");
      const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
      
      if (admin) {
        const results = await IdeaService.autoSeed(admin.id);
        console.info(`Scheduler: Successfully generated ${results.length} new ideas.`);
      } else {
        console.warn("Scheduler: Task skipped - No ADMIN user found in database.");
      }
    } catch (err) {
      console.error("Scheduler: Automation task failed -", err);
    }
  };

  // Run immediately on startup (for demo/dev purposes) if needed, 
  // or just set the interval. Let's just set the interval.
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  
  setInterval(runAutomation, TWENTY_FOUR_HOURS);
  
  console.info("Scheduler: AI Idea Automation active.");
};
