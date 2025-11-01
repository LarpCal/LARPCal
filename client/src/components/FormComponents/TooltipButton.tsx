import { IconButton, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

type TooltipButtonProps = {
  handleClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  title: string;
  icon: IconDefinition;
};

function TooltipButton({ handleClick, icon, title }: TooltipButtonProps) {
  return (
    <Tooltip title={title}>
      <IconButton onClick={handleClick}>
        <FontAwesomeIcon icon={icon} />
      </IconButton>
    </Tooltip>
  );
}

export default TooltipButton;
