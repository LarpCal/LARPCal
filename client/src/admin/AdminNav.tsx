import { Link, List, ListItem, Stack } from "@mui/material";
import { Link as NavLink } from "react-router-dom";

function AdminNav() {
  return (
    <Stack
      className="adminNav"
      justifyContent={"center"}
      alignItems="center"
      direction="column"
      sx={{
        position: "sticky",
        top: 0,
        "& .MuiPaper-root": {
          border: "none",
        },
      }}
    >
      <List>
        <ListItem>
          <Link component={NavLink} to="/admin/events">
            LARPs
          </Link>
        </ListItem>
        <ListItem>
          <Link component={NavLink} to="/admin/users">
            Users
          </Link>
        </ListItem>
        <ListItem>
          <Link component={NavLink} to="/admin/orgs">
            Organizers
          </Link>
        </ListItem>
        <ListItem>
          <Link component={NavLink} to="/admin/newsletters">
            Newsletters
          </Link>
        </ListItem>
      </List>
    </Stack>
  );
}

export default AdminNav;
