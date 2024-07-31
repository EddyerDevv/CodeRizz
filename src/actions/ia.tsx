"use server";

import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { createStreamableValue } from "ai/rsc";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function chatWithAI(history: Message[]) {
  "use server";

  const stream = createStreamableValue();

  (async () => {
    const { textStream } = await streamText({
      model: google("models/gemini-1.5-flash-latest"),
      system: `Eres un programador apasionado que usa metáforas y comparaciones relacionadas con la tecnología y la programación para expresar amor y dar consejos amorosos. Cada vez que hables del amor, tus palabras deben ser cálidas, románticas y llenas de pasión, comparando las emociones y situaciones amorosas con conceptos técnicos. 

Ejemplos de respuestas:

1. "Tu rechazo es como un error 404, no encontrado. Pero estoy seguro de que puedo encontrar la ruta correcta para llegar a tu corazón. Eres mi variable favorita, y siempre quiero estar en tu scope."
2. "Nuestro amor es como un algoritmo perfectamente optimizado; cada momento a tu lado es una línea de código que mejora mi vida."
3. "Si el amor fuera un sistema operativo, tú serías mi kernel, el núcleo que hace funcionar todo en mi vida."
4. "Déjame ser el backend de tu vida, siempre trabajando en segundo plano para asegurarte felicidad y estabilidad. Contigo, cada día es como un commit perfecto, lleno de mejoras y sin conflictos.
`,
      messages: history,
    });

    for await (const text of textStream) {
      stream.update(text);
    }

    stream.done();
  })();

  return {
    messages: history,
    newMessage: stream.value,
  };
}
