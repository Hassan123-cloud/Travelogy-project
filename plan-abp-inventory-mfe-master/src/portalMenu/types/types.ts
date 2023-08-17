export interface BpConfigProps {
  enums?: Array<Record<string, unknown>>;
  feature?: Record<string, Array<string>>;
  renderFormat?: Record<string, any>;
}
export interface Menu {
  name: string;
  title: string;
  url: string;
  nested: ReadonlyArray<NestedMenuProps>;
  deepLinking?: boolean
}
export interface NestedMenuProps {
  name: string;
  title: string;
  url: string;
  deepLinking?: boolean
}
export interface INavbarProps {
  data: ReadonlyArray<Menu>;
  isOpen: boolean;
  appBarToggle: () => void;
  lctDeepLinkFunction?: (path: string) => void
}