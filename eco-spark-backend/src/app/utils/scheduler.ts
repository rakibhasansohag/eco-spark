import cron from "node-cron";
import { IdeaService } from "../module/idea/idea.service.js";
import prisma from "../lib/prisma.js";

/**
 * Starts a background cron job to automatically generate AI ideas
 * at 12:00 AM every day. It uses the first available admin user as the author.
 */
export const startIdeaAutomationScheduler = async () => {
  console.info("Scheduler: Initializing AI Idea Automation (12:00 AM Cron)...");

  // Define the task
  const runAutomation = async () => {
    try {
      console.info("Scheduler: Running daily AI idea generation batch (Midnight task)...");
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

  // Schedule to run at 12:00 AM (midnight) every day
  // Minute 0, Hour 0, Day *, Month *, DayOfWeek *
  cron.schedule("0 0 * * *", runAutomation);
  
  console.info("Scheduler: AI Idea Automation active (Cron set to 00:00).");
};
