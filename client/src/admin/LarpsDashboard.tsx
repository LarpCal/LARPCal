import { useFetchLarps } from "../hooks/useFetchLarps";
import { Box } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { JSDateToLuxon } from "../util/typeConverters";
import AvailabilityIcon from "./AvailabilityIcon";
import LarpAPI from "../util/api";
import DeleteButton from "../components/FormComponents/DeleteButton";
import EditButton from "../components/FormComponents/EditButton";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Link } from "@mui/material";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ToastMessage from "../components/ui/ToastMessage";
import { Larp } from "../types";
import ToggleFeaturedButton from "../components/FormComponents/ToggleFeaturedButton";

function LarpsDashboard() {
  const { larps, setLarps, loading, error } = useFetchLarps(null);
  const navigate = useNavigate();

  async function handleDelete(id: number) {
    await LarpAPI.DeleteLarp(id);
    setLarps(() => larps.filter((larp) => larp.id !== id));
  }

  async function toggleFeatured(larp: Larp) {
    const { organization, ...larpForUpdate } = larp;

    const updated = await LarpAPI.UpdateLarp({
      ...larpForUpdate,
      isFeatured: !larpForUpdate.isFeatured,
    });
    setLarps(() => {
      const newLarps = larps.map((newLarp) => {
        if (newLarp.id !== larp.id) return newLarp;
        return { ...updated, organization };
      });
      return newLarps;
    });
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 50 },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      renderCell: (params) => {
        return (
          <Link component={RouterLink} to={`/admin/events/${params.row.id}`}>
            {params.row.title}
          </Link>
        );
      },
    },
    {
      field: "organization",
      headerName: "Organization",
      renderCell: (params) => {
        return (
          <Link component={RouterLink} to={`/admin/orgs/${params.value.id}`}>
            {params.value.orgName}
          </Link>
        );
      },
    },
    {
      field: "start",
      headerName: "Start",
      type: "date",
      renderCell: (params) => {
        return JSDateToLuxon(params.value).toLocaleString({
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      field: "end",
      headerName: "End",
      type: "date",
      renderCell: (params) => {
        return JSDateToLuxon(params.value).toLocaleString({
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      field: "ticketStatus",
      headerName: "Ticket Status",
      align: "center",
      renderCell: (params) => <AvailabilityIcon status={params.value} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 200,
      getActions: (params) => {
        return [
          <DeleteButton handleDelete={() => handleDelete(params.row.id)} />,
          <ToggleFeaturedButton
            handleClick={() => toggleFeatured(params.row)}
            isFeatured={params.row.isFeatured}
          />,
          <EditButton
            handleClick={() => navigate(`/admin/events/${params.row.id}/edit`)}
          />,
        ];
      },
    },
  ];

  const rows: GridRowsProp = larps.map((larp) => ({
    ...larp,
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

export default LarpsDashboard;
