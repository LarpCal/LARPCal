import * as yup from "yup";

export const newsletterSchema = yup.object({
  subject: yup.string().required("Subject is required").max(200),
  text: yup.string().required("Text is required"),
});
