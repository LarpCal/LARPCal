import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useIdParam } from "../hooks/useIdParam";
import LarpAPI from "../util/api";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ToastMessage from "../components/ui/ToastMessage";
import { Box, Typography } from "@mui/material";
import { NewsletterForm } from "../components/Forms/NewsletterForm";
import { Formik } from "formik";
import { NewsletterForCreate } from "../types";
import { newsletterSchema } from "../components/Forms/newsletterSchema";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useNewsletter } from "../hooks/useNewsletter";
import { DateTimeFormat } from "../components/ui/DateTimeFormat";

export default function NewsletterEditPage() {
  const orgId = useIdParam();
  const newsletterId = useIdParam("newsletterId", false);

  const {
    data: newsletter,
    isLoading,
    isError,
    error,
  } = useNewsletter(newsletterId);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    async mutationFn(data: NewsletterForCreate) {
      if (newsletterId) {
        return LarpAPI.updateOrgNewsletter(orgId, newsletterId, data);
      }
      return LarpAPI.createOrgNewsletter(orgId, data);
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["orgNewsletters", orgId],
      });
      navigate(`/orgs/${orgId}/newsletters`);
    },
  });

  const handleCancel = useCallback(() => {
    navigate(`/orgs/${orgId}/newsletters`);
  }, []);

  if (isLoading) {
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
        {newsletter ? "Edit Newsletter" : "Create Newsletter"}
      </Typography>

      {!!newsletter?.sentAt && (
        <Typography>
          Newsletter sent on{" "}
          <DateTimeFormat time>{newsletter.sentAt}</DateTimeFormat>
          {". "}You cannot edit a newsletter that has already been sent.
        </Typography>
      )}

      <Formik
        initialValues={newsletter ?? emptyNewsletter}
        onSubmit={mutate}
        validationSchema={newsletterSchema}
      >
        <NewsletterForm
          onCancel={handleCancel}
          disabled={!!newsletter?.sentAt}
        />
      </Formik>
    </Box>
  );
}

const emptyNewsletter = {
  subject: "",
  text: "",
} satisfies NewsletterForCreate;
