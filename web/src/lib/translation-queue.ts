
import prisma from "@/lib/db";
import { sendSSEUpdate } from "@/lib/sse";

type Task = () => Promise<void>;

class TranslationQueue {
  private queue: Task[] = [];
  private processing = false;
  private concurrency = 2; // Allow 2 parallel translations
  private activeCount = 0;
  private minInterval = 1100; // 1.1 seconds between starting tasks to respect 10 req/10s limit
  private lastStartTime = 0;

  async add(task: Task): Promise<void> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          await task();
          resolve();
        } catch (error) {
          reject(error);
        }
      });
      this.processNext();
    });
  }

  private async processNext() {
    if (this.activeCount >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const now = Date.now();
    const timeSinceLastStart = now - this.lastStartTime;
    
    if (timeSinceLastStart < this.minInterval) {
      // Delay starting the next task
      setTimeout(() => this.processNext(), this.minInterval - timeSinceLastStart);
      return;
    }

    this.lastStartTime = Date.now();
    this.activeCount++;
    const task = this.queue.shift();

    if (task) {
      try {
        await task();
      } catch (error) {
        console.error("Queue task failed:", error);
      } finally {
        this.activeCount--;
        this.processNext();
      }
    }
  }
}

export const translationQueue = new TranslationQueue();
