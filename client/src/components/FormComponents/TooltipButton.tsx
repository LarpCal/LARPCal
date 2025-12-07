import { IconButton, IconButtonProps, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

type TooltipButtonProps = {
  tooltip: string;
  icon: IconDefinition;
};

function TooltipButton({
  icon,
  tooltip,
  ...rest
}: TooltipButtonProps & IconButtonProps) {
  return (
    <Tooltip title={tooltip}>
      <span>
        <IconButton {...rest}>
          <FontAwesomeIcon icon={icon} />
        </IconButton>
      </span>
    </Tooltip>
  );
}

export default TooltipButton;
