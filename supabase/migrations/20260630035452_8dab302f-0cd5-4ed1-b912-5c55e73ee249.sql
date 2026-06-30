
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;

CREATE POLICY "Anyone can submit a valid lead"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(nome)) BETWEEN 1 AND 120
  AND length(btrim(email)) BETWEEN 3 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(btrim(celular)) BETWEEN 8 AND 30
  AND length(btrim(cidade)) BETWEEN 1 AND 120
  AND length(btrim(estado)) = 2
  AND length(btrim(mes)) BETWEEN 1 AND 20
  AND ano ~ '^\d{4}$'
  AND length(btrim(convidados)) BETWEEN 1 AND 10
  AND length(btrim(orcamento)) BETWEEN 1 AND 60
);

CREATE POLICY "No public read of leads"
ON public.leads
FOR SELECT
TO anon, authenticated
USING (false);
