import React from 'react';
import { Formik } from 'formik';
import { JSDateToLuxon, LuxonToJSDate } from '../util/typeConverters';

import LarpFormSchema from '../components/Forms/LarpFormSchema';
import { Larp, LarpForCreate, LarpForUpdate } from '../types';
import { Tag } from '../types';

type Props<T> = {
  children: React.ReactNode;
  larp: T;
  onSubmitCallback: (formData: T) => Promise<void>;
};

function LarpFormProvider<T extends Larp | LarpForCreate | LarpForUpdate>({
  larp,
  onSubmitCallback,
  children,
}: Props<T>) {
  function joinTags(tags: Tag[] | undefined): string | undefined {
    if (!tags || tags.length === 0) return '';

    const tagString = tags.reduce((accumulator, current) => {
      if (accumulator === '') return current.name;
      return `${accumulator}, ${current.name}`;
    }, '');
    return tagString;
  }

  function modelToFormValues(larp: T) {
    return {
      ...larp,
      tags: joinTags(larp.tags),
      start: larp.start ? JSDateToLuxon(larp.start) : undefined,
      end: larp.end ? JSDateToLuxon(larp.end) : undefined,
    };
  }

  function splitTags(tagString: string): Partial<Tag>[] {
    if (!tagString || tagString.trim() === '') return [];
    const splitTags = tagString.split(',');
    const filteredTags = splitTags.filter((tag) => tag.trim().length > 0);
    const tags = filteredTags.map((tag) => {
      return { name: tag.trim().toLowerCase() };
    });

    return tags;
  }

  function formValuesToLarp(values: any): T {
    return {
      ...values,
      start: values.start ? LuxonToJSDate(values.start) : undefined,
      end: values.end ? LuxonToJSDate(values.end) : undefined,
      tags: splitTags(values.tags),
    };
  }

  return (
    <Formik
      initialValues={modelToFormValues(larp)}
      onSubmit={async (values) =>
        await onSubmitCallback(formValuesToLarp(values as T))
      }
      validationSchema={LarpFormSchema}
    >
      {children}
    </Formik>
  );
}

export { LarpFormProvider };
