import { NextResponse, type NextRequest } from 'next/server'

// Middleware simples para Edge Runtime — sem dependências Node.js
// Verifica o cookie de sessão do Supabase diretamente
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Cookie name do Supabase (formato: sb-<project-ref>-auth-token)
  const projectRef = 'sbilvocobtjeytwtgoiy'
  const authCookie = request.cookies.get(`sb-${projectRef}-auth-token`)
  const hasSession = !!authCookie?.value

  const isAuthPage = ['/login', '/register', '/forgot-password'].some(p => pathname.startsWith(p))
  const isProtected = ['/dashboard', '/recolhas', '/carteira', '/perfil', '/admin'].some(p => pathname.startsWith(p))

  if (!hasSession && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (hasSession && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
