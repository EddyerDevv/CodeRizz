import {openai} from "@ai-sdk/openai";
import {generateText} from "ai";

const systemPrompt = "Actúa como un generador de títulos de conversación. Te proporcionaré una conversación completa, y tu tarea es resumirla en un título simple y claro que capture el tema principal de la conversación. El título debe ser breve, representativo del contenido y no debe incluir ningún texto adicional, solo el título. Aquí está la conversación";

export async function POST(
    req: Request,
) {
    const { messages } = await req.json();
    console.log(messages);

    const result = await generateText({
        model: openai("gpt-4o-mini"),
        system: systemPrompt,
        messages,
    });

    return new Response(result.text);
}
