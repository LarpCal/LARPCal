type ApproveButtonProps = {
  handleClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

import { Tooltip, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

function ApproveButton({ handleClick }: ApproveButtonProps) {
  return (
    <>
      <Tooltip title="Approve this organizer">
        <IconButton
          onClick={(e) => {
            handleClick(e);
          }}
        >
          <FontAwesomeIcon icon={faCheckCircle} />
        </IconButton>
      </Tooltip>
    </>
  );
}

export default ApproveButton;
