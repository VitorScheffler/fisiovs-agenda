import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth";

const PROTECTED_PREFIXES = [
  "/home",
  "/agenda",
  "/pacientes",
  "/equipe",
  "/solicitacoes",
  "/configuracoes",
];

const PATIENT_ONLY_PREFIXES = ["/agendar"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isPatientArea = PATIENT_ONLY_PREFIXES.some((p) => pathname.startsWith(p));
  const isLoginPage = pathname === "/login";

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  // Usuário já autenticado tentando acessar /login → redireciona para home
  if (isLoginPage && session) {
    if (session.role === "paciente") {
      return NextResponse.redirect(new URL("/agendar", request.url));
    }
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!isProtected && !isPatientArea) {
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Pacientes não acessam o painel administrativo
  if (isProtected && session.role === "paciente") {
    return NextResponse.redirect(new URL("/agendar", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/home/:path*",
    "/agenda/:path*",
    "/pacientes/:path*",
    "/equipe/:path*",
    "/solicitacoes/:path*",
    "/configuracoes/:path*",
    "/agendar/:path*",
  ],
};