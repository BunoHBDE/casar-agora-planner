## Definir novo favicon

1. Upload da imagem `Design sem nome (4).png` (logo CM Sítio Canto da Mata) via `lovable-assets` como `favicon.png`, gerando `public/favicon.png.asset.json`.
2. Atualizar `src/routes/__root.tsx` para referenciar a nova URL do asset nos links `icon` / `apple-touch-icon` (removendo/substituindo o favicon antigo).
3. Remover o `public/favicon.ico` antigo se existir, para não sobrescrever.
4. Verificar no preview que o favicon aparece na aba.