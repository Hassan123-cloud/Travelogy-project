import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { NavBar } from "./Navbar/Navbar";
import { Menu, NestedMenuProps } from '../types/types';
import _ from "lodash";
import { fetchData, getBaseAPIMUrl } from "@jda/lui-portal-utilities";

export interface INavMenuListProps {
  isOpen: boolean;
  displayLabels?: Record<string, any>;
  appBarToggle: () => void;
  deepLinkCallback?: (path: string, isDeepLink?: boolean) => void;
  token?: string;
}

/**
 * translates the menus data to the selected available language, if language is not available defaults to the english
 * @param menus menus data
 * @param displayLabels translation data
 * @returns {ReadonlyArray<Menu>}
 */
export const translateData = (menus: ReadonlyArray<Menu>, displayLabels?: Record<string, any>) => {
  return menus.map((menu: Menu) => {
    return {
      ...menu,
      title: _.get(displayLabels, `translations.navbar.${menu.name.toLowerCase()}.title`, menu.title),
      nested: menu.nested.map((nestedMenu: NestedMenuProps) => {
        return {
          ...nestedMenu,
          title: _.get(displayLabels, `translations.navbar.${menu.name.toLowerCase()}.submenus.${nestedMenu.name.toLowerCase()}.title`, nestedMenu.title),
        };
      }),
    };
  });
};

const NavBarContainer = (props: INavMenuListProps) => {
  const [navMenuList, setNavMenuList] = useState<ReadonlyArray<Menu>>([]);
  const { displayLabels, isOpen, appBarToggle, deepLinkCallback } = props;

  useEffect(() => {
    const getNavMenuList = async (baseUrl: string) => {
      const url = `${baseUrl}/lct/bff/v1/bff/navigation`;

      const response: AxiosResponse = await fetchData(url);
      // Applying internationalization to the menus and subMenus data which are getting as displayLabels prop
      setNavMenuList(translateData(response.data ?? [], displayLabels));
    };
    getBaseAPIMUrl().then((res) => {
      getNavMenuList(res);
    })
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <NavBar
      data={navMenuList}
      isOpen={isOpen}
      appBarToggle={appBarToggle}
      lctDeepLinkFunction={deepLinkCallback}
    />
  );
};

export default NavBarContainer;
