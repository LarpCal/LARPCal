import { Link, Typography } from "@mui/material";
import { FC, useMemo } from "react";
import Markdown, { Components } from "react-markdown";
import { Link as RouterLink } from "react-router-dom";

export const BodyText: FC<{ text?: string }> = ({ text }) => {
  const components: Components = useMemo(
    () => ({
      p: ({ children }) => <Typography paragraph>{children}</Typography>,
      a: ({ children, href, ref, ...props }) =>
        href ? (
          <Link
            {...props}
            component={RouterLink}
            to={href}
            rel="noopener noreferrer"
          >
            {children}
          </Link>
        ) : (
          <a {...props} ref={ref}>
            {children}
          </a>
        ),
    }),
    [],
  );
  if (!text?.trim()) {
    return null;
  }
  return <Markdown components={components}>{text}</Markdown>;
};
