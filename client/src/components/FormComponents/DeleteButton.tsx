type DeleteButtonProps = {
  handleDelete: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
};

import {
  Button,
  Dialog,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function DeleteButton({ handleDelete }: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <Dialog open={showConfirm}>
        <Stack sx={{ padding: "1rem" }} spacing={2}>
          <Typography>Are you sure you want to delete this record?</Typography>
          <Stack direction="row" spacing={1} alignSelf="center">
            <Button
              variant="contained"
              onClick={(e) => {
                handleDelete(e);
              }}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setShowConfirm(false);
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Dialog>
      <Tooltip title="Delete">
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            setShowConfirm(true);
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </IconButton>
      </Tooltip>
    </>
  );
}

export default DeleteButton;
