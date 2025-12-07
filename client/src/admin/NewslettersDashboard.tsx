import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LarpAPI from "../util/api";
import { Newsletter } from "../types";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { useFetchOrg } from "../hooks/useFetchOrg";
import { LinkIconButton } from "../components/FormComponents/LinkIconButton";
import {
  faEye,
  faPencil,
  faFileCirclePlus,
  faTrash,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import TooltipButton from "../components/FormComponents/TooltipButton";
import { DateTimeFormat } from "../components/ui/DateTimeFormat";
import { TextLink } from "../components/ui/TextLink";

export function NewslettersDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["newsletters"],
    queryFn: () => LarpAPI.getAllNewsletters(),
  });
  return (
    <Box
      sx={{
        height: "85dvh",
        width: "100%",
      }}
    >
      <Stack direction="row" m="1rem">
        <LinkIconButton
          to="/admin/newsletters/new"
          icon={faFileCirclePlus}
          title="Create Newsletter"
        />
      </Stack>
      <DataGrid columns={columns} rows={data} loading={isLoading} />
    </Box>
  );
}

const columns: GridColDef<Newsletter>[] = [
  {
    field: "id",
    headerName: "ID",
    type: "number",
    width: 50,
  },
  {
    field: "orgName",
    headerName: "Organization",
    renderCell(params) {
      if (!params.row.orgId) {
        return "Admin";
      }
      return <LarpOrgLink orgId={params.row.orgId} />;
    },
  },
  {
    field: "subject",
    headerName: "Subject",
    flex: 1,
    renderCell(params) {
      return (
        <TextLink to={`/admin/newsletters/${params.row.id}`}>
          {params.row.subject}
        </TextLink>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell(params) {
      if (params.row.sentAt) {
        return (
          <Typography variant="details1" color="success.main">
            Sent on <DateTimeFormat>{params.row.sentAt}</DateTimeFormat>
          </Typography>
        );
      }
      return <Typography variant="details1">Draft</Typography>;
    },
  },
  {
    field: "actions",
    type: "actions",
    headerName: "Actions",
    width: 200,
    align: "left",
    getActions({ row }) {
      const isSent = !!row.sentAt;
      const actions = [
        <LinkIconButton
          tooltip="View Preview"
          icon={faEye}
          to={`/newsletters/${row.id}`}
        />,
        <SendNewsletterButton
          newsletterId={row.id}
          isSent={isSent || row.orgId !== null}
        />,
        <LinkIconButton
          tooltip="Edit Newsletter"
          icon={faPencil}
          to={`/admin/newsletters/${row.id}`}
        />,
        <DeleteNewsletterButton newsletterId={row.id} isSent={isSent} />,
      ];
      return actions;
    },
  },
];

function LarpOrgLink({ orgId }: { orgId: number }) {
  const { org, loading } = useFetchOrg(orgId);
  if (loading) {
    return <Skeleton width={100} variant="text" />;
  }
  return <TextLink to={`/admin/orgs/${orgId}`}>{org?.orgName}</TextLink>;
}

interface NewsletterButtonProps {
  newsletterId: number;
  isSent: boolean;
}

function SendNewsletterButton({ newsletterId, isSent }: NewsletterButtonProps) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return LarpAPI.sendNewsletter(newsletterId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletters"] });
    },
  });
  return (
    <TooltipButton
      tooltip="Send Newsletter"
      icon={faPaperPlane}
      disabled={isPending || isSent}
      onClick={() => mutate()}
    />
  );
}

function DeleteNewsletterButton({
  newsletterId,
  isSent,
}: NewsletterButtonProps) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return LarpAPI.deleteNewsletter(newsletterId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletters"] });
    },
  });
  return (
    <TooltipButton
      tooltip="Delete Newsletter"
      icon={faTrash}
      color="error"
      disabled={isPending || isSent}
      onClick={() => mutate()}
    />
  );
}
