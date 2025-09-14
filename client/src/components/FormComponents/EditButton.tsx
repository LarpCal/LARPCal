import { Tooltip, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

type EditButtonProps = {
  handleClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

function EditButton({ handleClick }: EditButtonProps) {
  return (
    <Tooltip title="Edit">
      <IconButton onClick={handleClick}>
        <FontAwesomeIcon icon={faPencil} />
      </IconButton>
    </Tooltip>
  );
}

export default EditButton;
