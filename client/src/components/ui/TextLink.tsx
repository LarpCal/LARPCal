import { Link, LinkProps } from "@mui/material";
import { FC } from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";

export const TextLink: FC<LinkProps & RouterLinkProps> = (props) => {
  return <Link component={RouterLink} {...props} />;
};
