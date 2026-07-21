import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Removido: functionMiddleware com attachSupabaseAuth (rodava
// supabase.auth.getSession() no navegador em toda chamada de função do
// servidor, sem necessidade, já que o site não tem nenhuma feature de
// login. Isso sozinho estava embutindo o SDK inteiro de auth do
// Supabase no bundle JS enviado a cada visitante.
// Os arquivos de integração do Supabase (auth-attacher.ts, client.ts,
// etc.) continuam intactos — só paramos de conectá-los aqui.
export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware],
}));
