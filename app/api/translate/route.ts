import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { DIALECT_NOTES } from "@/lib/data";

const MODEL = process.env.HOGEN_MODEL ?? "claude-opus-4-8";

const SCHEMA = {
  type: "object",
  properties: {
    translation: { type: "string", description: "翻訳結果の文" },
    reading: { type: "string", description: "翻訳結果のよみがな（ひらがな）" },
    note: { type: "string", description: "ニュアンスや使い方の一言解説（40字以内）" },
  },
  required: ["translation", "reading", "note"],
  additionalProperties: false,
} as const;

export async function POST(req: Request) {
  let body: { text?: string; from?: string; to?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "リクエストが不正です" }, { status: 400 });
  }

  const { text, from, to } = body;
  if (!text?.trim() || !from || !to) {
    return NextResponse.json({ error: "text / from / to は必須です" }, { status: 400 });
  }
  if (text.length > 500) {
    return NextResponse.json({ error: "500文字以内で入力してください" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "翻訳機能はただいま準備中です。診断・クイズ・辞書はすべて使えるので、そちらで遊んでいてください🙏" },
      { status: 500 },
    );
  }

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system:
        "あなたは日本の方言研究の専門家です。指定された方言間の翻訳を行います。" +
        "実際にその地域で使われる自然な言い回しにしてください。誇張したステレオタイプ表現は避け、" +
        "日常会話として自然なレベルの方言にします。意味が変わらないことを最優先してください。" +
        (DIALECT_NOTES[from] ? `\n\n【${from}の特徴】${DIALECT_NOTES[from]}` : "") +
        (DIALECT_NOTES[to] ? `\n\n【${to}の特徴】${DIALECT_NOTES[to]}` : ""),
      output_config: { format: { type: "json_schema", schema: SCHEMA } },
      messages: [
        {
          role: "user",
          content: `次の文を「${from}」から「${to}」に翻訳してください。\n\n${text}`,
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json({ error: "この内容は翻訳できませんでした" }, { status: 422 });
    }

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "翻訳結果を取得できませんでした" }, { status: 502 });
    }
    const data = JSON.parse(textBlock.text);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "APIキーが未設定です。.env.local に ANTHROPIC_API_KEY を設定してください" },
        { status: 500 },
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "混み合っています。少し待って再試行してください" }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({ error: `APIエラー: ${error.message}` }, { status: 502 });
    }
    return NextResponse.json({ error: "翻訳に失敗しました" }, { status: 500 });
  }
}
