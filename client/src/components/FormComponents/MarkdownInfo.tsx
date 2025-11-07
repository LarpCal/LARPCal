import { Box, Typography } from "@mui/material";
import { FC } from "react";

export const MarkdownInfo: FC = () => (
  <details>
    <Typography variant="caption" component="summary">
      You can use Markdown here. Click for help.
    </Typography>
    <Box component="ul" ml="1.5rem">
      <Typography component="li">
        To make a paragraph, add a blank line between lines of text.
      </Typography>
      <Typography component="li">
        For a line break, append two spaces to the end of the line.
      </Typography>
      <Typography component="li">
        To make text <em>italic</em>, wrap it in underscores or asterisks:{" "}
        <code>_italic_ or *italic*</code>.
      </Typography>
      <Typography component="li">
        To make text <strong>bold</strong>, wrap it in double asterisks:{" "}
        <code>**bold**</code>.
      </Typography>
      <Typography component="li">
        To create a link, use the format:{" "}
        <code>[link text](https://example.com)</code>
      </Typography>
      <Typography component="li">
        To create a list, start lines with dashes, asterisks, or plus signs:
        <br />
        <code>
          - Item 1
          <br />- Item 2
        </code>
      </Typography>
      <Typography component="li">
        For headers, start a line with one or two hash symbols (#):
        <br />
        <code># This is a header</code>
      </Typography>
    </Box>
  </details>
);
