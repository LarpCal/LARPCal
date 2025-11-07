import { Box, Link, Typography } from "@mui/material";
import { FC, useMemo } from "react";
import Markdown, { Options } from "react-markdown";
import { Link as RouterLink } from "react-router-dom";

export const BodyText: FC<{ text?: string }> = ({ text }) => {
  const options: Options = useMemo(
    () => ({
      allowedElements: [
        "p",
        "a",
        "strong",
        "em",
        "br",
        "ul",
        "ol",
        "li",
        "code",
        "pre",
        "blockquote",
        "h1",
        "h2",
      ],
      components: {
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
        h1: ({ children }) => <Typography variant="h4">{children}</Typography>,
        h2: ({ children }) => <Typography variant="h5">{children}</Typography>,
        ul: ({ children }) => (
          <Box component="ul" ml="1.5rem">
            {children}
          </Box>
        ),
        ol: ({ children }) => (
          <Box component="ol" ml="1.5rem">
            {children}
          </Box>
        ),
        li: ({ children }) => (
          <Typography component="li">{children}</Typography>
        ),
      },
    }),
    [],
  );
  if (!text?.trim()) {
    return null;
  }
  return <Markdown {...options}>{text}</Markdown>;
};
