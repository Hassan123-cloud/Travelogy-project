import {
  AppNavigationDeepLink,
  // CollaborationDisplayIconMessage,
  CustomAvatarMenu,
  CustomAvatarMenuRequestMessage,
  HamburgerDisplayIconMessage,
  Message,
  // NotificationDisplayIconMessage,
  PortalMessageService,
} from "@jda/lui-portal-utilities";

/**
 * DEEP LINKING TO EXTERNAL APPS
 * This utility is to be used by Map to
 * trigger deeplinks to other applications
 *
 * @param {string} appName Name of the outgoing app
 * @param {string} path Name of the relative path
 */
export const navigateToProductDetail = (event: any, portalNamespace: string, path: string) => {
  const message = new AppNavigationDeepLink(portalNamespace, path);
  PortalMessageService.getInstance().sendMessageToPortal(
    message
  );
};

/**
 * LCT webapp navigation deeplink utility
 * @param appName
 * @param path
 */
export const LCTWebappDeepLink = (path: string, toCore?: boolean) => {
  const lctCoreAppName = 'luminate-control-tower-core';
  const lctAppName = 'luminate-control-tower';
  const appName = !toCore ? lctAppName : lctCoreAppName;
  if (path.includes('luminate-map')) {
    return navigateToProductDetail(undefined, 'luminate-map', '');
  }
  return navigateToProductDetail(undefined, appName, path);
};

/**
 * Displays icons on portal app bar
 * @param allDisabledItems  System Configuration , displaying alerts and sr icons if they are not present in disabled items
 * @param accessLevels User Access Levels, display SR icon only if SR is present in the items
 * @param customAvatarMenu custom avatar menu
 */
export function displayNavBarIcons(
  allDisabledItems?: ReadonlyArray<string>,
  accessLevels?: ReadonlyArray<string>,
  customAvatarMenu?: CustomAvatarMenu
) {
  // const notificationsMessage = new NotificationDisplayIconMessage(
  //   allDisabledItems !== undefined &&
  //   !allDisabledItems.some((item) => item.toLowerCase() === "alerts")
  // );
  // sendMessageToPortal(notificationsMessage);
  const hamburgerDisplayMessage = new HamburgerDisplayIconMessage(true);
  sendMessageToPortal(hamburgerDisplayMessage);
  // const message = new CollaborationDisplayIconMessage(allDisabledItems !== undefined &&
  //   !allDisabledItems.some((item) => item.toLowerCase() === "situationroom") &&
  //   (accessLevels !== undefined && accessLevels.some(acessLevel => acessLevel.toLowerCase() === 'situation room')));
  // sendMessageToPortal(message);
  if (customAvatarMenu) {
    const customAvatarMenuRequestMessage = new CustomAvatarMenuRequestMessage(
      customAvatarMenu
    );
    sendMessageToPortal(customAvatarMenuRequestMessage);
  }
}

export function sendMessageToPortal(message: Message) {
  PortalMessageService.getInstance().sendMessageToPortal(message);
}

export function registerListener(eventHandler: (messageData: any) => void) {
  PortalMessageService.getInstance().registerListener(eventHandler);
}