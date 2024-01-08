const notifier = require('node-notifier');
const schedule = require('node-schedule');

export function getNotification(text: string) {
  const notification = {
    title: 'SketchDaily',
    message: text,
    icon: 'E:/downloads/apple.png',
    wait: false,
    appID: process.env.NODE_ENV === 'development' ? process.execPath : 'ru.intelrug.sketchdaily',
  };
  return notification;
}

export function inputTimeToCron(inputTimeString: string) {
  const [hours, minutes] = inputTimeString.split(':');
  return `${minutes} ${hours} * * *`;
}

export function createNotification(text: string) {
  notifier.notify(getNotification(text));

  notifier.once('timeout', () => {
    notifier.removeAllListeners();
  });
}

export function scheduleNotification(text: string, time: string, notificationJob: any) {
  if (notificationJob) {
    notificationJob.cancel();
  }

  const newNotificationJob = schedule.scheduleJob(inputTimeToCron(time), () => {
    createNotification(text);
  });

  return newNotificationJob;
}

export function cancelAllNotifications(notificationJob: any) {
  if (notificationJob) {
    notificationJob.cancel();
    return null;
  }

  return notificationJob;
}

export function scheduleNotificationIfNeeded(
  enableNotifications: boolean,
  notificationText: string,
  notificationTime: string,
  notificationJob: any,
) {
  if (enableNotifications) {
    scheduleNotification(notificationText, notificationTime, notificationJob);
  } else {
    cancelAllNotifications(notificationJob);
  }
}
