import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client for use in Server Components, Server Actions, and
 * Route Handlers. Uses @supabase/ssr for cookie-based session management.
 */
export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            const secureOptions = {
                                ...options,
                                secure: process.env.NODE_ENV === 'production',
                                httpOnly: true,
                            }
                            cookieStore.set(name, value, secureOptions)
                        })
                    } catch {
                        // `setAll` was called from a Server Component where cookies
                        // are read-only. This is expected — the middleware handles
                        // session refreshes instead.
                    }
                },
            },
        }
    )
}
