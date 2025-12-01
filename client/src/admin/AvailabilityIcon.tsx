import { TicketStatus } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleDot,
  faCircleHalfStroke,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Icon, Tooltip } from "@mui/material";
import { formatTicketStatus } from "../util/utilities";

type RenderIcon = {
  icon: JSX.Element;
  color: string;
};

type AvailabilityIconProps = {
  status: TicketStatus;
};

function AvailabilityIcon({ status }: AvailabilityIconProps) {
  let renderIcon: RenderIcon;

  if (status === "AVAILABLE") {
    renderIcon = {
      icon: <FontAwesomeIcon icon={faCircleCheck} />,
      color: "green",
    };
  } else if (status === "LIMITED") {
    renderIcon = {
      icon: <FontAwesomeIcon icon={faCircleHalfStroke} />,
      color: "goldenrod",
    };
  } else if (status === "SOLD_OUT") {
    renderIcon = {
      icon: <FontAwesomeIcon icon={faCircleXmark} />,
      color: "red",
    };
  } else {
    renderIcon = {
      icon: <FontAwesomeIcon icon={faCircleDot} />,
      color: "blue",
    };
  }

  return (
    <Icon
      sx={{
        color: renderIcon.color,
        height: "100%",
      }}
    >
      <Tooltip title={formatTicketStatus(status)}>{renderIcon.icon}</Tooltip>
    </Icon>
  );
}

export default AvailabilityIcon;
