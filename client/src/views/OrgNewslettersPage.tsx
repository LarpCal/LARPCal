import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import LarpAPI from "../util/api";
import { useIdParam } from "../hooks/useIdParam";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ToastMessage from "../components/ui/ToastMessage";
import { Link } from "react-router-dom";
import { useCallback } from "react";
import { JSDateToLuxon } from "../util/typeConverters";

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

  if (isError) {
    return (
      <ToastMessage
        title="Sorry, there was a problem fetching this record"
        messages={error ? error.message : "Unknown error"}
      />
    );
  }

  return (
    <Box m="2rem">
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
            <ListItem key={newsletter.id}>
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
