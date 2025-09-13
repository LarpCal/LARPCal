import React from 'react';
import { Formik } from 'formik';
import {
  Organization,
  OrganizationForCreate,
  OrganizationForUpdate,
} from '../types';

type Props<T> = {
  children: React.ReactNode;
  org: T;
  schema: any;
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

  function formValuesToLarp(values: any): T {
    return {
      ...values,
    };
  }

  return (
    <Formik
      initialValues={modelToFormValues(org)}
      onSubmit={async (values) =>
        await onSubmitCallback(formValuesToLarp(values as T))
      }
      validationSchema={schema}
    >
      {children}
    </Formik>
  );
}

export { OrgFormProvider };
