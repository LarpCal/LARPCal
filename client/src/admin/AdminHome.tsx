import { useState } from "react";
import { Box, Drawer, IconButton, Stack } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { Outlet } from "react-router-dom";
import AdminNav from "./AdminNav";

const DRAWER_WIDTH = 150;

function AdminHome() {
  const [isOpen, setIsOpen] = useState(true);

  function toggleDrawer() {
    setIsOpen(() => !isOpen);
  }

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      className="Admin-pageContainer"
      sx={{
        height: "100%",
        maxWidth: "100vw",
        position: "relative",
      }}
    >
      <Drawer
        className="adminNav"
        open={isOpen}
        variant="persistent"
        anchor="left"
        sx={{
          position: "sticky",
          top: 0,
          width: `${DRAWER_WIDTH}px`,
          "& .MuiDrawer-paper": {
            borderRight: "none",
            width: isOpen ? `${DRAWER_WIDTH}px` : "0px",
            position: "relative", // Ensure button is positioned within the container
          },
        }}
      >
        <AdminNav />
      </Drawer>

      <Stack
        direction="row"
        alignItems="flex-start"
        className="Admin-dashboardContainer"
        sx={{
          flexGrow: 1,
          width: isOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%",
          height: "100%",
        }}
      >
        <IconButton
          onClick={toggleDrawer}
          sx={{
            position: "sticky",
            top: 0,
          }}
        >
          <FontAwesomeIcon
            icon={isOpen ? faChevronCircleLeft : faChevronCircleRight}
          />
        </IconButton>
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Stack>
    </Stack>
  );
}

export default AdminHome;
