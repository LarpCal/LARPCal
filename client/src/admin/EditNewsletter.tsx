import { Box, Typography } from "@mui/material";
import { useIdParam } from "../hooks/useIdParam";
import { NewsletterForm } from "../components/Forms/NewsletterForm";
import { Formik } from "formik";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LarpAPI from "../util/api";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorDisplay from "../components/FormComponents/ErrorDisplay";
import { NewsletterForCreate } from "../types";
import { newsletterSchema } from "../components/Forms/newsletterSchema";

export function EditNewsletter() {
  const id = useIdParam("id", false);

  const {
    data: newsletter,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin", "newsletter", id],
    queryFn: () => LarpAPI.getNewsletterById(id!),
    enabled: !!id,
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: NewsletterForCreate) => {
      if (id) {
        return LarpAPI.updateNewsletter(id, data);
      } else {
        return LarpAPI.createNewsletter(data);
      }
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["newsletters"],
      });
      navigate("/admin/newsletters");
    },
  });

  const handleCancel = useCallback(() => {
    navigate("/admin/newsletters");
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box m="1rem">
      {error && <ErrorDisplay message={error.message} />}
      <Typography variant="h2" component="h1">
        {id ? `Edit Newsletter #${id}` : "New Newsletter"}
      </Typography>
      <Formik
        initialValues={newsletter ?? emptyNewsletter}
        onSubmit={mutate}
        validationSchema={newsletterSchema}
      >
        <NewsletterForm
          onCancel={handleCancel}
          disabled={!!newsletter?.sentAt || isPending}
        />
      </Formik>
    </Box>
  );
}

const emptyNewsletter = {
  subject: "",
  text: "",
} satisfies NewsletterForCreate;
