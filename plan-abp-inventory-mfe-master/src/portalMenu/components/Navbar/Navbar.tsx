import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Palette } from "@jda/lui-common-component-library";
import { BrowserRouter } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Collapse,
} from "@material-ui/core";
import {
  ArrowChevronUp,
  ArrowChevronDown,
} from "@jda/lui-common-icon-library";
import { INavbarProps, Menu, NestedMenuProps } from '../../types/types';
import NavLink from "./NavLink/NavLink";

const drawerWidth = 296;

const useStyles = makeStyles((theme) => ({
  root: {
    "&.MuiButtonBase-root": {
      "&:hover": {
        paddingLeft: "15px !important",
      },
    },
  },
  button: {
    "&.MuiButtonBase-root": {
      "&:hover": {
        backgroundColor: `${Palette.colors.byBlue["50"]}40`,
      },
    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: Palette.colors.byDarkBlue["900"],
    overflowX: "hidden",
    zIndex: 1201
  },
  subListChild: {
    paddingLeft: theme.spacing(4),
    '&:hover': {
      backgroundColor: Palette.colors.byDarkBlue["800"]
    }
  },
  svgAlign: {
    float: "right",
    color: theme.palette.background.paper,
  },
  fontColor: {
    color: theme.palette.background.paper,
  },
  selectedMenu: {
    backgroundColor: Palette.colors.darkBlueGrey["A700"] + "!important",
    borderLeftWidth: "5px",
    borderLeftStyle: "solid",
    borderLeftColor: Palette.colors.byBlue["400"],
  },
}));

export const NavBar = (props: INavbarProps) => {
  const navbarData = props.data;

  // menu object with array of urls including main url ex: {supply: ["/supply/shipment","/supply/delivery"]}
  const mainMenu: { [key: string]: ReadonlyArray<string> } = props.data.reduce(
    (accumalator, menu) => ({
      ...accumalator,
      [menu.name]:
        menu.nested.length > 0
          ? menu.nested.map((nestedMenu) => nestedMenu.url)
          : [menu.url],
    }),
    {}
  );

  //Checking current menu is selected or not.
  const isMenuSelected = (
    menu: { [key: string]: ReadonlyArray<string> },
    currentMenu: string,
    currentUrl: string
  ) =>
    Object.keys(menu).some(
      (name) => name === currentMenu && menu[name].includes(currentUrl)
    );

  const classes = useStyles();

  //State to manage the menu with sub list selection
  const [parentSubList, setParentSubList] = useState<{
    [key: string]: boolean;
  }>(
    props.data
      .filter((menu) => menu.nested.length > 0)
      .reduce(
        (accumalator, menu) => ({
          ...accumalator,
          [menu.title]: isMenuSelected(
            mainMenu,
            menu.name,
            window.location.pathname
          ),
        }),
        {}
      )
  );

  //Toggle the nested menu item selection.
  const subListhandleClick = (name: string) => {
    setParentSubList((prev: { [key: string]: boolean }) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        anchor="left"
        open={props.isOpen}
        onClose={() => {
          if (props.isOpen && props.appBarToggle) {
            props.appBarToggle()
          }
        }}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <BrowserRouter>
          <List id="menu-list">
            {navbarData.map((menu: Menu) => {
              return (
                <MenuItem
                  key={menu.name}
                  name={menu.name}
                  title={menu.title}
                  url={menu.url}
                  classes={classes}
                  subListhandleClick={subListhandleClick}
                  parentSubList={parentSubList}
                  nestedMenus={menu.nested}
                  isCollapsed={parentSubList[menu.name]}
                  toCore={!menu.deepLinking}
                  lctDeepLinkingFunc={props.lctDeepLinkFunction}
                />
              );
            })}
          </List>
        </BrowserRouter>
      </Drawer>
    </div>
  );
};

export interface IMainMenuProps {
  name: string;
  title: string;
  url: string;
  classes: Record<string, string>;
  deepLinking?: boolean;
  toCore?: boolean;
  lctDeepLinkingFunc?: (path: string) => void;
}

export interface IMenuItemProps {
  name: string;
  title: string;
  url: string;
  classes: Record<string, string>;
  subListhandleClick: (name: string) => void;
  parentSubList: { [key: string]: boolean };
  nestedMenus: ReadonlyArray<NestedMenuProps>;
  isCollapsed: boolean;
  toCore?: boolean;
  lctDeepLinkingFunc?: (path: string) => void;
}

export interface INestedMenuProps {
  nestedMenus: ReadonlyArray<NestedMenuProps>;
  isCollapsed: boolean;
  classes: Record<string, string>;
  lctDeepLinkingFunc?: (path: string) => void;
}

const SingleLevelMenuItem = (props: IMainMenuProps) => {
  const { title, url, classes, lctDeepLinkingFunc, toCore } = props;
  return (
    <ListItem
      activeClassName={classes.selectedMenu}
      to={url}
      toCore={toCore}
      lctDeepLinkingFunc={lctDeepLinkingFunc}
      component={NavLink}
      button
      key={title}
      classes={{
        root: classes.button
      }}
      selected={url === window.location.pathname}
    >
      <ListItemText>
        <Typography gutterBottom className={classes.fontColor}>
          {title}
        </Typography>
      </ListItemText>
    </ListItem>
  );
};

const MenuItem = ({
  name,
  title,
  url,
  classes,
  subListhandleClick,
  parentSubList,
  nestedMenus,
  isCollapsed,
  lctDeepLinkingFunc,
  toCore,
}: IMenuItemProps) => {
  return nestedMenus.length === 0 ? (
    <SingleLevelMenuItem
      name={name}
      title={title}
      url={url}
      classes={classes}
      toCore={toCore}
      lctDeepLinkingFunc={lctDeepLinkingFunc}
    />
  ) : (
    <React.Fragment>
      <ListItem
        button
        key={title}
        classes={{
          root: classes.button
        }}
      >
        <ListItemText onClick={() => subListhandleClick(name)}>
          <Typography
            component="span"
            gutterBottom
            className={classes.fontColor}
          >
            {title}
          </Typography>
          {parentSubList[name] ? (
            <ArrowChevronUp className={classes.svgAlign} />
          ) : (
            <ArrowChevronDown className={classes.svgAlign} />
          )}
        </ListItemText>
      </ListItem>
      <NestedMenu
        nestedMenus={nestedMenus}
        isCollapsed={isCollapsed}
        classes={classes}
        lctDeepLinkingFunc={lctDeepLinkingFunc}
      />
    </React.Fragment>
  );
};

const NestedMenu = (props: INestedMenuProps) => {
  const { nestedMenus, isCollapsed, classes, lctDeepLinkingFunc } = props;
  return (
    <Collapse in={isCollapsed} timeout="auto" unmountOnExit>
      <List component="div" className="navSubListItem">
        {nestedMenus.map((nestedMenu) => {
          const toCore = !nestedMenu.deepLinking;
          return (
            <ListItem
              activeClassName={classes.selectedMenu}
              lctDeepLinkingFunc={lctDeepLinkingFunc}
              component={NavLink}
              toCore={toCore}
              to={nestedMenu.url}
              key={nestedMenu.title}
              className={classes.subListChild}
            >
              <ListItemText>
                <Typography gutterBottom className={classes.fontColor}>
                  {nestedMenu.title}
                </Typography>
              </ListItemText>
            </ListItem>
          );
        })}
      </List>
    </Collapse>
  );
};
