import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";

interface LinkIconButtonProps {
  to: string;
  icon: IconDefinition;
  tooltip?: string;
}

export function LinkIconButton(
  props: LinkIconButtonProps & Omit<IconButtonProps<typeof Link>, "component">,
) {
  const { tooltip, to, icon, ...rest } = props;
  const button = (
    <IconButton {...rest} component={Link} to={to}>
      <FontAwesomeIcon icon={icon} />
    </IconButton>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        <span>{button}</span>
      </Tooltip>
    );
  }

  return button;
}
