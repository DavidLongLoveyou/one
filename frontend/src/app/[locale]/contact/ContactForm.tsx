'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitContactForm } from './actions';
import { Button } from '@/components/ui/button';

interface ContactFormProps {
  inquiryTypes: Array<{ label: string; value: string }>;
  successMessage?: string;
}

export function ContactForm({ inquiryTypes, successMessage }: ContactFormProps) {
  const [state, formAction] = useFormState(submitContactForm, null);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-green-800 mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
        {state?.errors?.name && (
          <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-green-800 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
        {state?.errors?.email && (
          <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-green-800 mb-2">
          Company
        </label>
        <input
          type="text"
          id="company"
          name="company"
          className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-green-800 mb-2">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="inquiry_type" className="block text-sm font-medium text-green-800 mb-2">
          I&apos;m interested in: <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {inquiryTypes.map((type) => (
            <label key={type.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="inquiry_type"
                value={type.value}
                required
                className="w-4 h-4 text-green-600 focus:ring-green-600"
              />
              <span className="text-green-700">{type.label}</span>
            </label>
          ))}
        </div>
        {state?.errors?.inquiry_type && (
          <p className="mt-1 text-sm text-red-600">{state.errors.inquiry_type[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-green-800 mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
        {state?.errors?.message && (
          <p className="mt-1 text-sm text-red-600">{state.errors.message[0]}</p>
        )}
      </div>

      {state?.success && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-800">
          {state.message || successMessage || 'Thank you! We will respond within 24 hours.'}
        </div>
      )}

      {state?.success === false && state?.message && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
          {state.message}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold disabled:opacity-50"
    >
      {pending ? 'Sending...' : 'Send Message'}
    </Button>
  );
}

