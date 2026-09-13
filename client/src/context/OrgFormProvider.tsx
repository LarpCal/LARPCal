import React from "react";
import { Formik } from "formik";
import {
  Organization,
  OrganizationForCreate,
  OrganizationForUpdate,
} from "../types";

type Props<T> = {
  children: React.ReactElement;
  org: T;
  schema: unknown;
  onSubmitCallback: (formData: T) => Promise<void>;
};

function OrgFormProvider<
  T extends Organization | OrganizationForCreate | OrganizationForUpdate,
>({ org, onSubmitCallback, schema, children }: Props<T>) {
  return (
    <Formik
      initialValues={org}
      onSubmit={onSubmitCallback}
      validationSchema={schema}
    >
      {children}
    </Formik>
  );
}

export { OrgFormProvider };
