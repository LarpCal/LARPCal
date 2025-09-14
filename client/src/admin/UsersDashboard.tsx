import { Box, IconButton, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

import LarpAPI from "../util/api";
import DeleteButton from "../components/FormComponents/DeleteButton";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";
import { useFetchUsers } from "../hooks/useFetchUsers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import ToastMessage from "../components/ui/ToastMessage";
import LoadingSpinner from "../components/ui/LoadingSpinner";

function UsersDashboard() {
  const { users, setUsers, loading, error } = useFetchUsers();

  async function handleDelete(username: string) {
    await LarpAPI.DeleteUser(username);
    setUsers(() => users.filter((user) => user.username !== username));
  }

  const columns: GridColDef[] = [
    {
      field: "username",
      headerName: "Username",
      flex: 1,
    },
    {
      field: "firstName",
      headerName: "First",
      flex: 0.5,
    },
    {
      field: "lastName",
      headerName: "Last",
      flex: 0.5,
    },
    {
      field: "email",
      headerName: "email",
      flex: 1,
      renderCell: (params) => {
        return (
          <Link component={RouterLink} to={`mailto:${params.row.email}`}>
            {params.row.email}
          </Link>
        );
      },
    },
    {
      field: "organization",
      headerName: "Organization",
      flex: 1,
      renderCell: (params) => {
        return (
          <Link
            component={RouterLink}
            to={`/admin/orgs/${params.row.organization?.id}`}
          >
            {params.row.organization?.orgName}
          </Link>
        );
      },
    },
    {
      field: "isAdmin",
      headerName: "Admin?",
      align: "center",
      renderCell: (params) => {
        return params.row.isAdmin ? (
          <Typography variant="details1" color="success.main">
            <FontAwesomeIcon icon={faCircleCheck} />
          </Typography>
        ) : (
          ""
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 200,
      getActions: (params) => {
        if (params.row.username === "testUser") {
          return [
            <IconButton disabled>
              <FontAwesomeIcon icon={faTrash} />
            </IconButton>,
          ];
        }

        return [
          <DeleteButton
            handleDelete={() => handleDelete(params.row.username)}
          />,
        ];
      },
    },
  ];

  const rows: GridRowsProp = users.map((user) => ({
    ...user,
  }));

  return loading ? (
    <LoadingSpinner />
  ) : (
    <>
      <ToastMessage
        title="Sorry, there was a problem loading your data"
        messages={error}
      />
      <Box
        sx={{
          height: "85dvh",
          width: "100%",
        }}
      >
        <DataGrid columns={columns} rows={rows} />
      </Box>
    </>
  );
}

export default UsersDashboard;
