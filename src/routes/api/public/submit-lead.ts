import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const LeadSchema = z.object({
  nome: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  celular: z.string().trim().min(8).max(30),
  cidade: z.string().trim().max(120).optional().default(""),
  estado: z.string().trim().max(2).optional().default(""),
  mes: z.string().trim().min(1).max(20),
  ano: z.string().trim().regex(/^\d{4}$/),
  convidados: z.string().trim().min(1).max(10),
  orcamento: z.string().trim().max(60).optional().default("Não informado"),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/public/submit-lead")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      POST: async ({ request }) => {
        try {
          const json = await request.json();
          const parsed = LeadSchema.safeParse(json);
          if (!parsed.success) {
            return Response.json(
              { error: "Dados inválidos." },
              { status: 400, headers: corsHeaders },
            );
          }
          const lead = parsed.data;

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          const { error: insertError } = await supabaseAdmin.from("leads").insert(lead);
          if (insertError) {
            console.error("[submit-lead] insert error", insertError);
            return Response.json(
              { error: "Não foi possível salvar agora. Tente novamente." },
              { status: 500, headers: corsHeaders },
            );
          }

          // Try to send the email if the infrastructure is ready.
          // Failing here must NOT break the form submission.
          try {
            const origin = new URL(request.url).origin;
            await fetch(`${origin}/lovable/email/transactional/send`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""}`,
              },
              body: JSON.stringify({
                templateName: "planilha-casamento",
                recipientEmail: lead.email,
                idempotencyKey: `lead-${lead.email}-${Date.now()}`,
                templateData: { nome: lead.nome, downloadUrl: `${origin}/planilha-organizacao-casamento.xlsx` },
              }),
            });
          } catch (emailErr) {
            console.warn("[submit-lead] email send skipped/failed", emailErr);
          }

          return Response.json({ ok: true }, { headers: corsHeaders });
        } catch (err) {
          console.error("[submit-lead] unexpected", err);
          return Response.json(
            { error: "Erro inesperado." },
            { status: 500, headers: corsHeaders },
          );
        }
      },
    },
  },
});
