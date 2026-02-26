/**
 * Generic shape for server action results.
 * This standardizes the success/error response format across all features.
 */
export type ActionState<T> = { success: true; data: T } | { success: false; error: string }

/**
 * Standardized wrapper for server actions to handle repetitive try/catch boilerplate.
 * Extracts a sensible error message from unknown errors (e.g., API errors, DB errors).
 *
 * @param action - The asynchronous server action logic to execute.
 * @param defaultErrorMessage - Fallback error message if one cannot be extracted.
 * @returns An ActionState object standardizing success/failure responses.
 */
export async function withActionHandler<T>(
  action: () => Promise<T>,
  defaultErrorMessage = "An unexpected error occurred"
): Promise<ActionState<T>> {
  try {
    const data = await action()
    return { success: true, data }
  } catch (err: unknown) {
    console.error(`Server Action Error (${defaultErrorMessage}):`, err)

    let message = defaultErrorMessage

    if (err instanceof Error) {
      message = err.message
    } else if (typeof err === "object" && err !== null) {
      // Handle known API error shapes (e.g., BetterAuth or custom fetch wrappers)
      const apiError = err as { body?: { message?: string }; message?: string; error?: string }
      message = apiError.body?.message || apiError.message || apiError.error || defaultErrorMessage
    } else if (typeof err === "string") {
      message = err
    }

    return { success: false, error: message }
  }
}
