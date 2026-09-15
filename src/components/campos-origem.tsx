import { useEffect, useState } from "react";

import { CAMPOS_ORIGEM, capturarOrigem, lerOrigem, type OrigemTrafego } from "@/lib/origem-trafego";

// Campos ocultos com a origem de tráfego, para irem no POST do formulário
// junto dos dados que a pessoa preencheu.
//
// O capturarOrigem() daqui é necessário além do que roda no __root: os
// efeitos dos filhos rodam antes do efeito do root, então sem esta chamada o
// primeiro render com valores pegaria a sessionStorage ainda vazia.
export function CamposOrigem() {
  // Antes do mount não há window: os campos saem com valor vazio no HTML do
  // servidor e no primeiro render do cliente, e só então são preenchidos —
  // é o que mantém a hidratação sem divergência.
  const [origem, setOrigem] = useState<OrigemTrafego | null>(null);

  useEffect(() => {
    capturarOrigem();
    setOrigem(lerOrigem());
  }, []);

  return (
    <>
      {CAMPOS_ORIGEM.map((campo) => (
        // readOnly: o valor é gerido por este componente, não pela pessoa —
        // e é o que dispensa o onChange num input controlado. Campo somente
        // leitura continua indo no envio (ao contrário de um disabled).
        <input key={campo} type="hidden" name={campo} value={origem?.[campo] ?? ""} readOnly />
      ))}
    </>
  );
}
