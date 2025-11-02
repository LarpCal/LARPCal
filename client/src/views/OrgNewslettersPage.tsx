import {
  Box,
  Button,
  IconButton,
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
import { JSDateToLuxon } from "../util/typeConverters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

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

  const queryClient = useQueryClient();
  const { mutate: handleSend, isPending: sendPending } = useMutation({
    mutationFn: (id: number) => LarpAPI.sendOrgNewsletter(orgId, id),
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["orgNewsletters", orgId],
      });
      showMessage("Newsletter sent successfully");
    },
  });
  const { mutate: handleDelete, isPending: deletePending } = useMutation({
    mutationFn: (id: number) => LarpAPI.deleteOrgNewsletter(orgId, id),
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["orgNewsletters", orgId],
      });
      showMessage("Newsletter deleted successfully");
    },
  });

  const dateToText = useCallback(
    (dateString: string) =>
      JSDateToLuxon(new Date(dateString)).toLocaleString({
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
                  disabled={sendPending || deletePending || !!newsletter.sentAt}
                  onDelete={() => handleDelete(newsletter.id)}
                  onSend={() => handleSend(newsletter.id)}
                />
              }
              disablePadding
            >
              <ListItemButton
                component={Link}
                to={`/orgs/${orgId}/newsletters/${newsletter.id}`}
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
  disabled: boolean;
  onSend: () => void;
  onDelete: () => void;
}

function NewsletterActions({
  disabled,
  onSend,
  onDelete,
}: NewsletterActionsProps) {
  return (
    <Stack direction="row" spacing={1}>
      <IconButton color="success" disabled={disabled} onClick={onSend}>
        <FontAwesomeIcon icon={faPaperPlane} />
      </IconButton>
      <IconButton color="error" disabled={disabled} onClick={onDelete}>
        <FontAwesomeIcon icon={faTrash} />
      </IconButton>
    </Stack>
  );
}
