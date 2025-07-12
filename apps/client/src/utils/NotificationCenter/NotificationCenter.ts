import { animate } from "framer-motion/dom";
import { config } from "../../config";

class NotificationCenter {
  private _listContainer: HTMLUListElement;

  constructor() {
    this._listContainer = this._getListContainer();
  }

  display = (message: string) => {
    if (this._listContainer.childNodes.length >= 5) {
      this._listContainer.lastChild?.remove();
      this._listContainer.prepend(this._createNotification(message));
    } else {
      this._listContainer.prepend(this._createNotification(message));
    }
  };

  reset = () => {
    this._listContainer.innerHTML = "";
  };

  initialize = () => {
    document.body.appendChild(this._listContainer);
  };

  private _getListContainer = () => {
    const list = document.createElement("ul");
    list.id = "notificationList";
    list.classList.add(
      "fixed",
      "top-0",
      "left-0",
      "right-0",
      "mx-auto",
      "flex",
      "flex-col",
      "gap-3",
      "items-center",
      "z-100",
      "w-full",
      "max-w-[400px]"
    );
    return list;
  };

  private _createNotification = (message: string) => {
    const notification = document.createElement("li");

    notification.innerHTML = `
      <div class="notification ${"mt-2 flex items-center gap-2 bg-(--ui_bg_lt) text-(--text_lt) dark:bg-(--ui_bg_dt) dark:text-(--text_dt) py-2 px-4 rounded-(--ui_radius) shadow cursor-pointer text-sm"}">
        <svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
        <p class="notificationText">${message}</p>
      </div>
    `;

    this.applyEnterAnimationTo(notification);

    notification.addEventListener("click", () =>
      this.removeNotification(notification)
    );

    setTimeout(() => this.removeNotification(notification), 4000);

    return notification;
  };

  private removeNotification = (notification: HTMLLIElement) => {
    this.applyExitAnimationTo(notification).finished.then(() => {
      notification.remove();
    });
  };

  private applyEnterAnimationTo = (notification: HTMLLIElement) => {
    return animate(
      notification,
      { opacity: [0, 1], transform: ["scale(0.5)", "scale(1)"] },
      { duration: config.animationDuration }
    );
  };

  private applyExitAnimationTo = (notification: HTMLLIElement) => {
    return animate(
      notification,
      { opacity: [1, 0], transform: ["scale(1)", "scale(0.5)"] },
      { duration: config.animationDuration }
    );
  };
}
export default NotificationCenter;
