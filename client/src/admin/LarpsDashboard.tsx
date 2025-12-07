import { useFetchLarps } from "../hooks/useFetchLarps";
import { Box } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { JSDateToLuxon } from "../util/typeConverters";
import AvailabilityIcon from "./AvailabilityIcon";
import LarpAPI from "../util/api";
import DeleteButton from "../components/FormComponents/DeleteButton";
import EditButton from "../components/FormComponents/EditButton";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ToastMessage from "../components/ui/ToastMessage";
import { Larp } from "../types";
import ToggleFeaturedButton from "../components/FormComponents/ToggleFeaturedButton";
import { useMutation } from "@tanstack/react-query";
import { TextLink } from "../components/ui/TextLink";

function LarpsDashboard() {
  const { larps, loading, error, refetch } = useFetchLarps();
  const navigate = useNavigate();

  const { mutate: deleteMutation } = useMutation({
    mutationFn: (id: number) => LarpAPI.DeleteLarp(id),
    onSuccess: () => {
      refetch();
    },
  });
  const { mutate: toggleFeaturedMutation } = useMutation({
    mutationFn(larp: Larp) {
      const { organization: _, ...larpForUpdate } = larp;

      return LarpAPI.UpdateLarp({
        ...larpForUpdate,
        isFeatured: !larpForUpdate.isFeatured,
      });
    },
    onSuccess: () => {
      refetch();
    },
  });

  const columns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 50 },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      renderCell: (params) => {
        return (
          <TextLink to={`/admin/events/${params.row.id}`}>
            {params.row.title}
          </TextLink>
        );
      },
    },
    {
      field: "organization",
      headerName: "Organization",
      renderCell: (params) => {
        return (
          <TextLink to={`/admin/orgs/${params.value.id}`}>
            {params.value.orgName}
          </TextLink>
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
          year: "numeric",
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
          year: "numeric",
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
          <DeleteButton handleDelete={() => deleteMutation(params.row.id)} />,
          <ToggleFeaturedButton
            handleClick={() => toggleFeaturedMutation(params.row)}
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
        messages={error?.message}
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
