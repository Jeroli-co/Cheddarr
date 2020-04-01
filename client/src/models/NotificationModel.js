const NOTIFICATION_LEVEL = {
  DANGER: { duration: 8000, color: "#800000", bgColor: "#ff9290" },
  WARNING: { duration: 4000, color: "#805500", bgColor: "#ffe8a3" },
  SUCCESS: { duration: 5000, color: "#006500", bgColor: "#bcffb7" },
};

class NotificationModel {
  constructor (message, level) {
    this.message = message;
    this.level = level;
  }
}

export {
  NOTIFICATION_LEVEL,
  NotificationModel
}
