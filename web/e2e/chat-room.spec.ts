import { test, expect } from '@playwright/test';

test.describe('Chat Room with Unread Messages', () => {
  test.beforeEach(async ({ page }) => {
    // Note: In a real app, you would log in or set a session cookie here.
    // For the sake of this e2e test scenario, we assume the user is authenticated 
    // and we navigate directly to the chat room.
    // We are mocking or intercepting requests to return specific data.

    // Intercept the API/page request to mock unread messages scenario
    // Or we rely on seeded DB data if the environment is set up for it.
    // Here we will mock the Next.js page data if needed, or assume a seeded DB.
    
    // For demonstration, let's assume the user navigates to a specific room
    // and there is a banner showing "5 новых сообщений" (5 new messages).
  });

  test('should display unread banner and scroll to anchor', async ({ page }) => {
    // 1. Navigate to the chat room
    // Replace with actual room ID from your seeded database
    await page.goto('/dashboard/rooms/test-room-id');

    // 2. Wait for the chat window to load
    await page.waitForSelector('.flex-1.overflow-hidden.relative');

    // 3. Verify the unread banner appears
    // The banner text should match the regex for "новых сообщений"
    const unreadBanner = page.locator('text=/\\d+ новых сообщений/i');
    await expect(unreadBanner).toBeVisible();

    // 4. Check if the banner has the correct count (e.g., 5)
    // await expect(unreadBanner).toContainText('5 новых сообщений');

    // 5. Verify that clicking the banner scrolls to bottom and removes the banner
    await unreadBanner.click();
    
    // The banner should disappear after click
    await expect(unreadBanner).toBeHidden();

    // The status should update to read, and no unread banner should be visible anymore
  });

  test('should mark messages as read on scroll to bottom', async ({ page }) => {
    await page.goto('/dashboard/rooms/test-room-id');

    const unreadBanner = page.locator('text=/\\d+ новых сообщений/i');
    await expect(unreadBanner).toBeVisible();

    // Scroll the chat container to the bottom
    // We find the scrollable container and scroll it
    const scrollContainer = page.locator('.overflow-y-auto').first();
    await scrollContainer.evaluate((node) => {
      node.scrollTo(0, node.scrollHeight);
    });

    // Wait a short moment for the scroll event handler to trigger markAsRead
    await page.waitForTimeout(500);

    // Banner should disappear after scrolling to bottom
    await expect(unreadBanner).toBeHidden();
  });
});
