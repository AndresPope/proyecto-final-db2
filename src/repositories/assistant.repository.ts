import {
  Assistant,
  CreateAssistantInput,
  UpdateAssistantInput,
} from "../domain/assistant.domain";
import { assistantModel } from "./models/assistant.model";
import { ulid } from "ulid";

export async function createMongoAssistant(input: CreateAssistantInput) {
  const response = await assistantModel.create({
    ...input,
    assistantId: ulid(),
  });
  return Assistant.fromMongo(response);
}

export async function listAllMongoAssistants() {
  const response = await assistantModel.find();
  return response.map((assistant) => Assistant.fromMongo(assistant));
}

export async function getMongoAssistantById(id: string) {
  const response = await assistantModel.findOne({ assistantId: id });
  if (!response) {
    throw new Error("Assistant not found");
  }
  return Assistant.fromMongo(response);
}

export async function updateMongoAssistant(request: UpdateAssistantInput) {
  const response = await assistantModel.findOneAndUpdate(
    { assistantId: request.assistantId },
    request.input,
    { new: true },
  );
  if (!response) {
    throw new Error("Assistant not found");
  }
  return Assistant.fromMongo(response);
}

export async function deleteMongoAssistant(id: string) {
  await assistantModel.deleteOne({ assistantId: id });
}

export async function assistantExists(id: string) {
  return await assistantModel.exists({ assistantId: id }).exec();
}
