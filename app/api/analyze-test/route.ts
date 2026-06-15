import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // Allow more time for AI processing

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType, skillsContext, subject, grade } = await req.json();

    if (!imageBase64 || !skillsContext || !process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Missing required fields or API key" }, { status: 400 });
    }

    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: imageBase64,
      },
    };

    const textPrompt = `Você é um avaliador pedagógico (Especialista em Ensino Fundamental).
Analise a prova do aluno na imagem e identifique quais das seguintes habilidades da BNCC/Currículo o aluno demonstrou dominar ao responder as questões corretamente.

DISCIPLINA: ${subject}
ANO: ${grade}º ANO

HABILIDADES DISPONÍVEIS PARA ESCOLHA:
${JSON.stringify(skillsContext, null, 2)}

INSTRUÇÕES:
1. Leia as respostas do aluno com atenção.
2. Identifique quais respostas estão corretas (ou satisfatórias para o nível).
3. Relacione as respostas corretas com as "Habilidades Disponíveis".
4. Retorne APENAS os IDs das habilidades que o aluno atingiu corretamente.
`;

    const textPart = { text: textPrompt };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            skillIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array de IDs das habilidades que o aluno demonstrou domínio.",
            },
          },
          required: ["skillIds"],
        },
      },
    });

    const textResponse = response.text || "{}";
    const result = JSON.parse(textResponse);

    return NextResponse.json({ skillIds: result.skillIds || [] });
  } catch (error) {
    console.error("Erro na leitura de prova:", error);
    return NextResponse.json({ error: "Erro ao analisar prova com IA" }, { status: 500 });
  }
}
