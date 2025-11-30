import { Box, Stack, Typography } from "@mui/material";
import { Tag } from "../../types";
import { base64Encode } from "../../util/utilities";
import { TextLink } from "../ui/TextLink";
import "./TagDisplay.scss";

type TagDisplayProps = {
  tag: Tag;
  fontSize?: number;
};

function TagDisplay({ tag, fontSize = 10 }: TagDisplayProps) {
  const query = base64Encode(JSON.stringify({ tags: tag.name }));

  return (
    <Stack direction="column" justifyContent="center">
      <Box className="tagDisplay">
        <TextLink to={`/events/?q=${query}`}>
          <Typography
            // className="tagDisplay"
            key={tag.name}
            variant="details2"
            sx={{
              fontSize: fontSize,
            }}
          >
            {tag.name}
          </Typography>
        </TextLink>
      </Box>
    </Stack>
  );
}

export default TagDisplay;
