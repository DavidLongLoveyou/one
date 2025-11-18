'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  inquiry_type: z.enum(['oem', 'green-beans', 'general']),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

export async function submitContactForm(prevState: any, formData: FormData) {
  // Validate form data with Zod
  const validatedFields = ContactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    company: formData.get('company') || undefined,
    phone: formData.get('phone') || undefined,
    inquiry_type: formData.get('inquiry_type'),
    message: formData.get('message'),
  });

  // Return validation errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your inputs.',
      success: false,
    };
  }

  try {
    // TODO: Send to your email service (e.g., Resend, SendGrid)
    // await sendEmail(validatedFields.data);
    
    // TODO: Optional: Store in database or CRM
    // await storeInCRM(validatedFields.data);

    // Log for now (remove in production)
    console.log('Contact form submission:', validatedFields.data);

    // Return success
    return {
      success: true,
      message: 'Thank you! We will respond within 24 hours.',
    };
  } catch (error) {
    console.error('Contact form error:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again or email us directly.',
    };
  }
}

