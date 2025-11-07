import { Box, Divider, Link, Typography } from "@mui/material";
import ErrorDisplay from "../components/FormComponents/ErrorDisplay";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useIdParam } from "../hooks/useIdParam";
import { useNewsletter } from "../hooks/useNewsletter";
import { DateTimeFormat } from "../components/ui/DateTimeFormat";
import { useBody } from "../hooks/useBody";
import { Link as RouterLink } from "react-router-dom";

export default function NewsletterPreviewPage() {
  const newsletterId = useIdParam();
  const { isLoading, error, data: newsletter } = useNewsletter(newsletterId);

  const text = useBody(newsletter?.text);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const from =
    newsletter?.orgName && newsletter?.orgId ? (
      <Link to={`/orgs/${newsletter.orgId}`} component={RouterLink}>
        {newsletter.orgName}
      </Link>
    ) : (
      "LARPcal Team"
    );

  return (
    <Box m="2rem">
      {error && <ErrorDisplay message={error.message} />}

      {!newsletter?.sentAt && (
        <Typography component="p" variant="h5" mb="1rem">
          Preview
        </Typography>
      )}

      <Typography>From: {from}</Typography>
      <Typography>Subject: {newsletter?.subject}</Typography>
      {newsletter?.sentAt && (
        <Typography>
          Sent: <DateTimeFormat time>{newsletter?.sentAt}</DateTimeFormat>
        </Typography>
      )}
      <Divider sx={{ my: "1rem" }} />
      {text}
    </Box>
  );
}
