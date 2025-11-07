import { Stack, StackProps } from "@mui/material";
import { faImage, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

import { LinkIconButton } from "../FormComponents/LinkIconButton";
import TooltipButton from "../FormComponents/TooltipButton";
import { useCallback } from "react";
import LarpAPI from "../../util/api";
import { useNavigate } from "react-router-dom";

import classes from "./LarpActions.module.scss";

type ActionsBarProps = {
  larpId: number;
  isAdmin?: boolean | null;
};

function LarpActions({
  larpId,
  isAdmin = false,
  className,
  ...stackProps
}: ActionsBarProps & StackProps) {
  const adminPrefix = isAdmin ? "/admin" : "";
  const navigate = useNavigate();
  const handleDelete = useCallback(() => {
    LarpAPI.DeleteLarp(larpId);
    navigate(`${adminPrefix}/events`);
  }, [larpId, adminPrefix]);

  return (
    <Stack
      {...stackProps}
      className={`${classes.stack} ${className ?? ""}`}
      direction="row"
      justifyContent="space-around"
    >
      <LinkIconButton
        to={`${adminPrefix}/events/${larpId}/image`}
        tooltip="Edit this Event"
        icon={faPencil}
      />
      <LinkIconButton
        to={`${adminPrefix}/events/${larpId}/image`}
        tooltip="Update Banner Image"
        icon={faImage}
      />
      <TooltipButton
        tooltip="Delete this Event"
        icon={faTrash}
        onClick={handleDelete}
      />
    </Stack>
  );
}

export default LarpActions;
