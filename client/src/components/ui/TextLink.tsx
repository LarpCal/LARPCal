import { Link, LinkProps } from "@mui/material";
import { FC } from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";

export const TextLink: FC<Omit<LinkProps, "component"> & RouterLinkProps> = (
  props,
) => {
  const { to } = props;
  if (
    typeof to === "string" &&
    to.startsWith("http") &&
    !to.includes(window.location.host)
  ) {
    return (
      <Link {...props} href={to} target="_blank" rel="noopener noreferrer" />
    );
  }
  return <Link component={RouterLink} {...props} />;
};
