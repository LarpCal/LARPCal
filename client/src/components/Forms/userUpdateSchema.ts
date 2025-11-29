import * as yup from "yup";

const userUpdateSchema = yup.object({
  password: yup
    .string()
    .min(8, "Passwords must be at least 8 characters long")
    .matches(
      /^(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])(?=.*\d)(?=.*[a-zA-Z]).+/,
      "Password must contain at least one number and one special character.",
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .when("password", {
      is: (val: unknown) => typeof val === "string" && val.length > 0,
      then: (schema) => schema.required("Please confirm your password"),
    }),
  firstName: yup.string(),
  lastName: yup.string(),
  email: yup
    .string()
    .email("Please provide a valid email")
    .required("Email is required"),
  subscribed: yup.boolean(),
});

export default userUpdateSchema;
