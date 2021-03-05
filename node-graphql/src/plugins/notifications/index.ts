import { Notification } from './subscription';
export * from './insert-notification';
export * from './update-all-notification';

export const NotificationPlugins = [
  //  NotificationSubscription,
];

export const NotificationSchemaPlugins = [
    Notification,
];
