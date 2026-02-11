import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * FISKAL MVP - Middleware (seguridad base)
 *
 * IMPORTANTE:
 * - No toca UI.
 * - Aplica control de acceso por ROL y estado (encuesta / pago inicial).
 * - Depende de cookies de sesión/estado ya emitidas por el frontend.
 *
 * Cookies esperadas (ajusta SOLO los nombres si tu proyecto ya usa otros):
 * - fk_role: "client" | "professional"
 * - fk_has_survey: "1" | "0"
 * - fk_paid_initial: "1" | "0"
 *
 * Nota:
 * - Si el usuario no tiene fk_role, se considera NO autenticado.
 */

const COOKIE_ROLE = "fk_role";
const COOKIE_HAS_SURVEY = "fk_has_survey";
const COOKIE_PAID_INITIAL = "fk_paid_initial";

function redirect(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url);
}

function truthy(v?: string | null) {
  if (!v) return false;
  const s = v.toLowerCase();
  return s === "1" || s === "true" || s === "yes";
}

function isPublicPath(pathname: string) {
  // Públicas (NO proteger)
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/confirm") ||
    pathname.startsWith("/forgot") ||
    pathname.startsWith("/reset") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/terms")
  ) {
    return true;
  }

  // APIs públicas / webhooks
  if (
    pathname.startsWith("/api/health") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/webhooks") ||
    pathname.startsWith("/api/square") ||
    pathname.startsWith("/api/send-meeting") ||
    pathname.startsWith("/api/google")
  ) {
    return true;
  }

  return false;
}

function isProtectedPath(pathname: string) {
  // Protegidas por defecto
  return (
    pathname.startsWith("/client") ||
    pathname.startsWith("/pro") ||
    pathname.startsWith("/professional") ||
    pathname.startsWith("/survey") ||
    pathname.startsWith("/professionals") ||
    pathname.startsWith("/agenda") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/case") ||
    pathname.startsWith("/dashboard-client") ||
    pathname.startsWith("/expert-dashboard") ||
    pathname.startsWith("/match-results") ||
    pathname.startsWith("/call")
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Next internals + assets
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  const roleRaw = req.cookies.get(COOKIE_ROLE)?.value ?? "";
  const role = roleRaw.toLowerCase();
  const hasSurvey = truthy(req.cookies.get(COOKIE_HAS_SURVEY)?.value);
  const paidInitial = truthy(req.cookies.get(COOKIE_PAID_INITIAL)?.value);

  const isAuthed = role === "client" || role === "professional";

  // Si autenticado, evita el login raíz
  if (pathname === "/" && isAuthed) {
    if (role === "professional") return redirect(req, "/expert-dashboard");
    return redirect(req, "/dashboard-client");
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Si NO autenticado y quiere ruta protegida -> login
  if (!isAuthed) {
    if (isProtectedPath(pathname)) return redirect(req, "/");
    return NextResponse.next();
  }

  // Si autenticado: evita pantallas de auth (por si entran por URL)
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/confirm")
  ) {
    return redirect(req, role === "professional" ? "/expert-dashboard" : "/dashboard-client");
  }

  // ====== ROL: PROFESIONAL ======
  if (role === "professional") {
    // Prohibido: encuesta / checkout / reservar
    if (pathname.startsWith("/survey")) return redirect(req, "/expert-dashboard");
    if (pathname.startsWith("/checkout")) return redirect(req, "/expert-dashboard");
    if (pathname.startsWith("/client")) return redirect(req, "/expert-dashboard");
    if (pathname.startsWith("/dashboard-client")) return redirect(req, "/expert-dashboard");

    // Permitido: /professional/*
    if (pathname.startsWith("/professional")) return NextResponse.next();
    if (pathname.startsWith("/pro")) return NextResponse.next();
    if (pathname.startsWith("/expert-dashboard")) return NextResponse.next();

    // Cualquier otra protegida -> /professional
    if (isProtectedPath(pathname)) return redirect(req, "/expert-dashboard");

    return NextResponse.next();
  }

  // ====== ROL: CLIENTE ======
  if (role === "client") {
    // Prohibido: pantallas de profesional
    if (pathname.startsWith("/pro")) return redirect(req, "/dashboard-client");
    if (pathname.startsWith("/professional")) return redirect(req, "/dashboard-client");
    if (pathname.startsWith("/expert-dashboard")) return redirect(req, "/dashboard-client");

    // 1) Encuesta: el cliente sí puede entrar a /survey
    // 2) Matching profesionales: permitir /professionals SOLO si tiene encuesta
    if (pathname.startsWith("/professionals") && !hasSurvey) {
      return redirect(req, "/survey");
    }


    // 3) Agenda/Checkout: SOLO si ya pagó inicial (USD 150)
    //    Nota: si además quieres forzar "seleccionó profesional", hazlo por cookie/flag adicional en el futuro.
    if ((pathname.startsWith("/agenda") || pathname.startsWith("/checkout")) && !paidInitial) {
      // Si no pagó, lo mandamos al listado de profesionales (pero si no hizo encuesta, irá a /survey arriba)
      return redirect(req, "/professionals");
    }

    // 4) /client / dashboard-client: permitido siempre
    if (pathname.startsWith("/client")) return NextResponse.next();
    if (pathname.startsWith("/dashboard-client")) return NextResponse.next();

    // Rutas protegidas restantes: permitir
    if (isProtectedPath(pathname)) return NextResponse.next();

    return NextResponse.next();
  }

  // Fallback
  return NextResponse.next();
}

export const config = {
  // Evita ejecutar en archivos estáticos
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
