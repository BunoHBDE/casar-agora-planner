## Causa

No formulário da home (`src/routes/index.tsx`, `CTAFinal`), o campo de convidados usa:
- `<Field label="Número de convidados">`
- `placeholder="Digite o número"`

Chrome (e gerenciadores de senha) usam heurística baseada no texto visível ao redor do input. A palavra **"Número"** próxima a um input numérico ativa o autofill de "número de cartão", mesmo com todos os `autocomplete="off"`.

Na `/lp` o mesmo campo aparece como `label="Convidados"` e `placeholder="80"` — sem a palavra "número" — e por isso não dispara a sugestão.

## Correção

Alinhar os textos do campo na home com os da `/lp`, sem mexer em nenhuma lógica de envio, tracking ou máscara:

1. Trocar o label do campo em `CTAFinal` de `"Número de convidados"` para `"Convidados"`.
2. Trocar o placeholder de `"Digite o número"` para `"80"` (mesmo valor da `/lp`).
3. Manter todos os atributos anti-autofill já existentes (`autoComplete="off"`, `data-lpignore`, `data-form-type="other"`, `inputMode="numeric"`, `id="numero-convidados"`, `name="convidados"`).

Nenhuma outra alteração — o `name="convidados"` continua o mesmo, então a coluna no Google Sheets segue intacta.

## Verificação

Após aplicar, abrir a home, focar o campo Convidados e confirmar que o Chrome não oferece mais o autofill de cartão.
