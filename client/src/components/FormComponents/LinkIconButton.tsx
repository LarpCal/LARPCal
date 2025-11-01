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
  if (props.tooltip) {
    const { tooltip, ...rest } = props;
    return (
      <Tooltip title={tooltip}>
        <LinkIconButton {...rest} />
      </Tooltip>
    );
  }

  const { to, icon, ...rest } = props;

  return (
    <IconButton {...rest} component={Link} to={to}>
      <FontAwesomeIcon icon={icon} />
    </IconButton>
  );
}
