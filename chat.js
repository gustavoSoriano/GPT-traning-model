import OpenAI from "openai";
import "dotenv/config";

async function main() {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
        model: "ft:gpt-4o-mini-2024-07-18:personal::AyqD4xH4",
        temperature: 0,
        messages: [
            {
                role: "user",
                content: "Que serviços a TechNova oferece ?",
            },
        ],
    });

    console.log(response.choices[0].message.content);
}

main();
