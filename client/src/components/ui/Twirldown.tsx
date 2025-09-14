import { ReactNode, useState } from "react";
import { Typography, Box, Stack } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faCaretDown } from "@fortawesome/free-solid-svg-icons";

type TwirldownProps = {
  children: ReactNode;
  title: string;
};

function Twirldown({ title, children }: TwirldownProps) {
  const [showChildren, setShowChildren] = useState<boolean>(false);

  function toggleDetails() {
    setShowChildren(!showChildren);
  }

  return (
    <Box className="Twirldown">
      <Stack
        aria-label="button"
        onClick={() => {
          toggleDetails();
        }}
        direction="row"
        spacing={1}
        sx={{
          cursor: "pointer",
        }}
      >
        <FontAwesomeIcon icon={showChildren ? faCaretDown : faCaretRight} />

        <Typography
          className="Twirldown-button"
          sx={{
            fontWeight: 900,
            marginTop: ".5rem",
          }}
        >
          {showChildren ? `Hide ${title}` : `Show ${title}`}
        </Typography>
      </Stack>
      {showChildren && children}
    </Box>
  );
}

export default Twirldown;
