import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LarpAPI from "../util/api";
import { useIdParam } from "../hooks/useIdParam";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ToastMessage from "../components/ui/ToastMessage";
import { Link } from "react-router-dom";
import { useCallback, useState } from "react";
import {
  faTrash,
  faPaperPlane,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import TooltipButton from "../components/FormComponents/TooltipButton";
import { LinkIconButton } from "../components/FormComponents/LinkIconButton";
import { DateTime } from "luxon";

export default function OrgNewslettersPage() {
  const orgId = useIdParam();

  const {
    data: newsletters,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["orgNewsletters", orgId],
    queryFn: async () => LarpAPI.getOrgNewsletters(orgId),
  });

  const [message, setMessage] = useState("");

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000);
  }, []);

  const dateToText = useCallback(
    (dateString: string) =>
      DateTime.fromISO(dateString).toLocaleString({
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    [],
  );

  if (isLoading || !newsletters) {
    return <LoadingSpinner />;
  }

  return (
    <Box m="2rem">
      {isError && (
        <ToastMessage
          title="Sorry, there was a problem fetching this record"
          messages={error ? error.message : "Unknown error"}
        />
      )}
      {message && (
        <ToastMessage title="Success" messages={message} severity="success" />
      )}
      <Typography variant="h1" mb="1rem">
        Newsletters
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to={`/orgs/${orgId}/newsletters/new`}
      >
        Add new
      </Button>
      {newsletters.length === 0 && (
        <Typography my="1rem">No newsletters yet.</Typography>
      )}
      {newsletters.length > 0 && (
        <List>
          {newsletters.map((newsletter) => (
            <ListItem
              key={newsletter.id}
              secondaryAction={
                <NewsletterActions
                  disabled={!!newsletter.sentAt}
                  orgId={orgId}
                  newsletterId={newsletter.id}
                  showMessage={showMessage}
                />
              }
              disablePadding
            >
              <ListItemButton
                component={Link}
                to={`/newsletters/${newsletter.id}`}
              >
                <ListItemText
                  primary={newsletter.subject}
                  secondary={
                    newsletter.sentAt
                      ? `Sent at ${dateToText(newsletter.sentAt)}`
                      : `Created ${dateToText(newsletter.createdAt)}`
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

interface NewsletterActionsProps {
  orgId: number;
  newsletterId: number;
  disabled: boolean;
  showMessage: (msg: string) => void;
}

function NewsletterActions({
  orgId,
  newsletterId,
  showMessage,
  disabled,
}: NewsletterActionsProps) {
  const queryClient = useQueryClient();
  const { mutate: onSend, isPending: sendPending } = useMutation({
    mutationFn: () => LarpAPI.sendOrgNewsletter(orgId, newsletterId),
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["orgNewsletters", orgId],
      });
      showMessage("Newsletter sent successfully");
    },
  });
  const { mutate: onDelete, isPending: deletePending } = useMutation({
    mutationFn: () => LarpAPI.deleteOrgNewsletter(orgId, newsletterId),
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["orgNewsletters", orgId],
      });
      showMessage("Newsletter deleted successfully");
    },
  });

  const isPending = sendPending || deletePending;

  return (
    <Stack direction="row" spacing={1}>
      <LinkIconButton
        tooltip="Edit Newsletter"
        icon={faPencil}
        to={`/orgs/${orgId}/newsletters/${newsletterId}`}
      />
      <TooltipButton
        tooltip="Send Newsletter"
        icon={faPaperPlane}
        disabled={disabled || isPending}
        onClick={() => onSend()}
      />
      <TooltipButton
        tooltip="Delete Newsletter"
        icon={faTrash}
        color="error"
        disabled={disabled || isPending}
        onClick={() => onDelete()}
      />
    </Stack>
  );
}
