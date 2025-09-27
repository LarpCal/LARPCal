import React from "react";
import { Formik } from "formik";
import {
  Organization,
  OrganizationForCreate,
  OrganizationForUpdate,
} from "../types";

type Props<T> = {
  children: React.ReactNode;
  org: T;
  schema: unknown;
  onSubmitCallback: (formData: T) => Promise<void>;
};

function OrgFormProvider<
  T extends Organization | OrganizationForCreate | OrganizationForUpdate,
>({ org, onSubmitCallback, schema, children }: Props<T>) {
  function modelToFormValues(org: T) {
    return {
      ...org,
    };
  }

  return (
    <Formik
      initialValues={modelToFormValues(org)}
      onSubmit={async (values) => await onSubmitCallback(values)}
      validationSchema={schema}
    >
      {children}
    </Formik>
  );
}

export { OrgFormProvider };
