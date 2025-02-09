import "dotenv/config";

import OpenAI from "openai";
import { createReadStream } from "fs";
import { resolve } from "path";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function uploadFile(filePath) {
    try {
        const file = await openai.files.create({
            file: createReadStream(resolve(filePath)),
            purpose: "fine-tune",
        });
        console.log("Arquivo enviado com sucesso. ID:", file.id);
        return file.id;
    } catch (error) {
        console.error("Erro ao enviar arquivo:", error);
        throw error;
    }
}

async function startTraining(fileId) {
    try {
        const fineTune = await openai.fineTuning.jobs.create({
            training_file: fileId,
            model: "gpt-4o-mini-2024-07-18",
        });
        console.log("Treinamento iniciado. Job ID:", fineTune.id);
        return fineTune.id;
    } catch (error) {
        console.error("Erro ao iniciar treinamento:", error);
        throw error;
    }
}

async function checkTrainingStatus(jobId) {
    try {
        const status = await openai.fineTuning.jobs.retrieve(jobId);
        console.log("Status atual:", status.status);
        return status;
    } catch (error) {
        console.error("Erro ao verificar status:", error);
        throw error;
    }
}

async function main() {
    try {
        const fileId = await uploadFile("./data/training-data.jsonl");

        const jobId = await startTraining(fileId);

        let status;

        do {
            status = await checkTrainingStatus(jobId);
            if (status.status === "succeeded") {
                console.log("Treinamento concluído com sucesso!");
                console.log("Informações completas do modelo:", status);
                break;
            } else if (status.status === "failed") {
                console.log("Treinamento falhou:", status.error);
                break;
            }

            await new Promise((resolve) => setTimeout(resolve, 5000));
        } while (true);
    } catch (error) {
        console.error("Erro durante o processo:", error);
    }
}

main();
