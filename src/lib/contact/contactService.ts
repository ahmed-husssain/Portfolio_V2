import { CONTACT_CONFIG } from '../../data/contact'

export interface ContactFormPayload {
  name: string
  email: string
  company?: string
  service?: string
  budget?: string
  message: string
  /**
   * Honeypot field: must remain empty. If filled, treated as bot spam.
   */
  website?: string
}

export interface FormValidationErrors {
  name?: string
  email?: string
  message?: string
}

export interface ContactSubmissionResult {
  success: boolean
  mode: 'delivered' | 'local_unconnected' | 'spam_rejected'
  message: string
  mailtoFallbackUrl?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validates the contact form payload on the client side.
 */
export function validateContactForm(payload: ContactFormPayload): FormValidationErrors {
  const errors: FormValidationErrors = {}

  const trimmedName = payload.name.trim()
  if (!trimmedName) {
    errors.name = 'Please provide your name.'
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  }

  const trimmedEmail = payload.email.trim()
  if (!trimmedEmail) {
    errors.email = 'Please provide your email address.'
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = 'Please provide a valid email address (e.g., name@domain.com).'
  }

  const trimmedMessage = payload.message.trim()
  if (!trimmedMessage) {
    errors.message = 'Please provide details about what you need.'
  } else if (trimmedMessage.length < 10) {
    errors.message = 'Please provide a bit more context (at least 10 characters).'
  }

  return errors
}

/**
 * Constructs a prefilled mailto link containing the user's inquiry.
 */
export function generateMailtoUrl(payload: ContactFormPayload): string {
  const subject = encodeURIComponent(
    `[Inquiry] ${payload.service || 'Web Development'} — ${payload.name.trim()}${
      payload.company ? ` (${payload.company.trim()})` : ''
    }`
  )

  const bodyContent = [
    `Name: ${payload.name.trim()}`,
    `Email: ${payload.email.trim()}`,
    payload.company ? `Company/Project: ${payload.company.trim()}` : null,
    payload.service ? `Area of Interest: ${payload.service}` : null,
    payload.budget ? `Budget Bracket: ${payload.budget}` : null,
    '',
    'Message:',
    payload.message.trim(),
  ]
    .filter((line) => line !== null)
    .join('\n')

  const body = encodeURIComponent(bodyContent)
  return `mailto:${CONTACT_CONFIG.email}?subject=${subject}&body=${body}`
}

/**
 * Provider-agnostic contact form submission handler.
 * Does NOT pretend an email was sent if no backend provider is connected.
 */
export async function submitContactForm(payload: ContactFormPayload): Promise<ContactSubmissionResult> {
  // 1. Check Honeypot spam trap
  if (payload.website && payload.website.trim().length > 0) {
    // Silently drop bot submission with an artificial delay
    await new Promise((resolve) => setTimeout(resolve, 600))
    return {
      success: true,
      mode: 'spam_rejected',
      message: 'Inquiry processed.',
    }
  }

  // 2. Client validation
  const errors = validateContactForm(payload)
  if (Object.keys(errors).length > 0) {
    throw new Error('Please correct the errors in the form before submitting.')
  }

  // 3. Check for configured live backend endpoint
  const endpointUrl = import.meta.env.VITE_CONTACT_API_URL

  if (endpointUrl && typeof endpointUrl === 'string') {
    try {
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: payload.name.trim(),
          email: payload.email.trim(),
          company: payload.company?.trim() || undefined,
          service: payload.service || undefined,
          budget: payload.budget || undefined,
          message: payload.message.trim(),
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`)
      }

      return {
        success: true,
        mode: 'delivered',
        message: 'Your inquiry has been transmitted successfully.',
      }
    } catch (err) {
      console.error('Contact form submission error:', err)
      throw new Error(
        'Unable to send message via the remote server. Please reach out directly via email.'
      )
    }
  }

  // 4. Fallback when no live backend endpoint is configured
  // Simulates transmission latency and provides an honest state
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    success: true,
    mode: 'local_unconnected',
    message:
      'Inquiry recorded. Since no external backend endpoint is connected yet, you can also launch your mail client with your prefilled message.',
    mailtoFallbackUrl: generateMailtoUrl(payload),
  }
}
