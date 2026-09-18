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

  // 3. Dispatch to live email destination
  // Uses custom VITE_CONTACT_API_URL if configured, otherwise dispatches directly to Ahmed's verified email via FormSubmit AJAX API
  const endpointUrl =
    import.meta.env.VITE_CONTACT_API_URL ||
    `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_CONFIG.email)}`

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
        _replyto: payload.email.trim(),
        company: payload.company?.trim() || 'Not specified',
        service: payload.service || 'Web Development',
        budget: payload.budget || 'Not specified',
        message: payload.message.trim(),
        _subject: `[Portfolio Inquiry] ${payload.service || 'Web Development'} — ${payload.name.trim()}${
          payload.company ? ` (${payload.company.trim()})` : ''
        }`,
        _template: 'table',
        _captcha: 'false',
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`)
    }

    return {
      success: true,
      mode: 'delivered',
      message: 'Your inquiry has been transmitted directly to Ahmed Hussain.',
    }
  } catch (err) {
    console.warn('Direct API transmission issue, engaging mailto fallback:', err)

    // Graceful fallback: If an adblocker or network error prevented external AJAX dispatch,
    // provide the prefilled mailto link so the user never loses their typed inquiry.
    return {
      success: true,
      mode: 'local_unconnected',
      message:
        'Your inquiry is prepared. Network dispatch was interrupted by browser privacy settings or connection. You can send it directly with 1 click via your mail client below.',
      mailtoFallbackUrl: generateMailtoUrl(payload),
    }
  }
}
