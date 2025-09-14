import { Stack } from "@mui/material";
import useLarpControls from "../hooks/useLarpControls";
import { Larp } from "../types";

type ActionsBarProps = {
  larp: Larp;
};

function ActionsBar({ larp }: ActionsBarProps) {
  // console.log(larp)

  const { DeleteLarpButton, EditLarpButton, ToggleFeaturedButton } =
    useLarpControls(larp);

  return (
    <Stack direction="row">
      {EditLarpButton}
      {DeleteLarpButton}
      {ToggleFeaturedButton}
    </Stack>
  );
}

export default ActionsBar;
