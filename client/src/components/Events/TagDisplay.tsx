import { Box, Link, Stack, Typography } from "@mui/material";
import { Tag } from "../../types";
import { Link as RouterLink } from "react-router-dom";
import "./TagDisplay.scss";
import { base64Encode } from "../../util/utilities";

type TagDisplayProps = {
  tag: Tag;
  fontSize?: number;
};

function TagDisplay({ tag, fontSize = 10 }: TagDisplayProps) {
  const query = base64Encode(JSON.stringify({ tags: tag.name }));

  return (
    <Stack direction="column" justifyContent="center">
      <Box className="tagDisplay">
        <Link component={RouterLink} to={`/events/?q=${query}`}>
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
        </Link>
      </Box>
    </Stack>
  );
}

export default TagDisplay;
