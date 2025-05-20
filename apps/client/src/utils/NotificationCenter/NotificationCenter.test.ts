import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import NotificationCenter from "./NotificationCenter.js";

vi.mock("framer-motion/dom", () => ({
  animate: () => ({
    finished: Promise.resolve(),
  }),
}));

describe("NotificationCenter.ts", () => {
  let notificationCenter: NotificationCenter;

  beforeEach(() => {
    document.body.innerHTML = ""; // Ensure clean DOM
    vi.useFakeTimers();
    notificationCenter = new NotificationCenter();
    notificationCenter.initialize();
  });

  afterEach(() => {
    notificationCenter.reset();
    vi.clearAllTimers();
  });

  it("should initialize correctly", () => {
    const list = document.getElementById("notificationList");

    expect(list).toBeInTheDocument();
  });

  it("should display notification correctly", () => {
    notificationCenter.display("test");

    const notification = document.querySelector(
      ".notification"
    ) as HTMLDivElement;
    const text = document.querySelector(".notificationText");

    expect(notification).toBeInTheDocument();
    expect(text).toHaveTextContent("test");
  });

  it("should not display more than 5 notifications at a time", () => {
    for (let i = 0; i < 7; i++) {
      notificationCenter.display("test");
    }

    const notifications = document.querySelectorAll(".notification");

    expect(notifications).toHaveLength(5);
  });

  it("every notification should disappear after 4 seconds", async () => {
    notificationCenter.display("Test message");

    const list = document.getElementById("notificationList")!;
    expect(list.children.length).toBe(1); // Ensure it shows up

    // Fast-forward the 4s timeout
    vi.advanceTimersByTime(4000);

    // Wait for both timers and microtasks (for .then())
    await vi.runAllTimersAsync();

    expect(list.children.length).toBe(0); // Should be gone
  });

  it("notification should be removed on click", async () => {
    const list = document.getElementById("notificationList")!;

    notificationCenter.display("test");

    const notification = list.children[0] as HTMLElement;

    notification.click();

    await vi.runAllTimersAsync();

    expect(list.children.length).toBe(0);
  });
});
