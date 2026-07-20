import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Creates a Supabase client specifically for use in Next.js middleware.
 * Handles cookie-based session management and token refresh.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            const secureOptions = {
              ...options,
              secure: process.env.NODE_ENV === 'production',
              httpOnly: true,
            }
            supabaseResponse.cookies.set(name, value, secureOptions)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser();
  console.log("Middleware checking user:", user?.id || "null");

  // Define protected and public routes
  const PUBLIC_ROUTES = [
    '/',
    '/login',
    '/signup', 
    '/guide',
    '/support',
    '/privacy',
    '/terms',
    '/api/',
  ]
  const authRoutes = ['/login', '/signup']
  
  // A route is protected if it is NOT in PUBLIC_ROUTES
  // (We check exact match for root '/', otherwise startsWith)
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    route === '/' ? request.nextUrl.pathname === '/' : request.nextUrl.pathname.startsWith(route)
  )
  const isProtectedRoute = !isPublicRoute

  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Redirect unauthenticated users away from protected routes
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
