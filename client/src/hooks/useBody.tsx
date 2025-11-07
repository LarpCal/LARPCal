import { Typography } from "@mui/material";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const urlRegex = /(https?:\/\/[^\s]+)/g;

export function useBody(text?: string) {
  return useMemo(() => {
    if (!text?.trim()) {
      return null;
    }
    return text
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        // Make URLs clickable.
        const parts = line.trim().split(urlRegex);

        return parts.map((part, idx) => {
          if (urlRegex.test(part)) {
            return (
              <Typography key={idx} paragraph>
                <Link to={part} target="_blank" rel="noopener noreferrer">
                  {part}
                </Link>
              </Typography>
            );
          }
          return (
            <Typography key={idx} paragraph>
              {line}
            </Typography>
          );
        });
      });
  }, [text]);
}
