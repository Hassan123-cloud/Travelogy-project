import React from "react";
import { NavLink } from "react-router-dom";

export interface IDeepLinkProps {
  to: string;
  lctDeepLinkingFunc?: (path: string, isDeepLink?: boolean | string) => void;
  toCore?: boolean | string;
}

function Nav(props: any) {
  const { lctDeepLinkingFunc, toCore, ...rest }: IDeepLinkProps = props;
  const onDeepLinkClick = () => {
    if (lctDeepLinkingFunc) {
      lctDeepLinkingFunc(props.to, toCore);
    }
  };
  return (
    <NavLink
     {...rest}
    onClick={onDeepLinkClick}
    />
  );
}

export default Nav;
