import { Box, Typography } from "@mui/material";
import ErrorDisplay from "../components/FormComponents/ErrorDisplay";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useIdParam } from "../hooks/useIdParam";
import { useNewsletter } from "../hooks/useNewsletter";
import { DateTime } from "luxon";

export default function NewsletterPreviewPage() {
  const newsletterId = useIdParam();
  const { isLoading, error, data: newsletter } = useNewsletter(newsletterId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box m="2rem">
      {error && <ErrorDisplay message={error.message} />}

      <Typography>Subject: {newsletter?.subject}</Typography>
      {newsletter?.sentAt && (
        <Typography>
          Sent: {DateTime.fromISO(newsletter?.sentAt).toLocaleString()}
        </Typography>
      )}
      <Typography mb="1rem">Body:</Typography>
      {newsletter?.text.split("\n").map((line, index) => (
        <Typography key={index}>{line}</Typography>
      ))}
    </Box>
  );
}
