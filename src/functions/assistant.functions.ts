import { Request, Response } from "express";
import {
  createAssistantInputSchema,
  updateAssistantInputSchema,
} from "../domain/assistant.domain";
import {
  assistantExists,
  createMongoAssistant,
  deleteMongoAssistant,
  getMongoAssistantById,
  listAllMongoAssistants,
  updateMongoAssistant,
} from "../repositories/assistant.repository";
import _ from "lodash";
import { errorHandler } from "../domain/handler.error";
import { z } from "zod";

export async function createAssistant(request: Request, response: Response) {
  try {
    const body = request.body;
    if (_.isEmpty(body)) {
      return response.status(400).json({
        message: "Missing body",
      });
    }
    const input = createAssistantInputSchema.parse(body);
    const assistant = await createMongoAssistant(input);
    return response.json(assistant);
  } catch (e) {
    errorHandler(e, response);
  }
}

export async function listAllRegisteredAssistants(
  _request: Request,
  response: Response,
) {
  try {
    const eventLocations = await listAllMongoAssistants();
    return response.json(eventLocations.map((assistant) => assistant.toJSON()));
  } catch (e) {
    errorHandler(e, response);
  }
}

export async function getAssistantById(request: Request, response: Response) {
  try {
    const queryId = request.query.id;
    if (!queryId) {
      return response.status(400).json({
        message: "Missing assistant id",
      });
    }
    if (typeof queryId !== "string") {
      return response.status(400).json({
        message: "assistantId must be a string",
      });
    }
    const locationId = z
      .string()
      .ulid("The id must be a valid ulid string")
      .parse(queryId);
    const assistant = await getMongoAssistantById(locationId);
    return response.json(assistant.toJSON());
  } catch (e) {
    errorHandler(e, response);
  }
}

export async function updateAssistant(request: Request, response: Response) {
  try {
    const body = request.body;
    if (_.isEmpty(body)) {
      return response.status(400).json({
        message: "Missing body",
      });
    }
    const updateInput = updateAssistantInputSchema.parse(body);
    const exists = await assistantExists(updateInput.assistantId);
    if (!exists) {
      return response.status(404).json({
        message: "Assistant not found",
      });
    }
    const assistant = await updateMongoAssistant(updateInput);
    return response.json(assistant.toJSON());
  } catch (e) {
    errorHandler(e, response);
  }
}

export async function deleteAssistant(request: Request, response: Response) {
  try {
    const queryId = request.query.id;
    if (!queryId) {
      return response.status(400).json({
        message: "Missing assistantId",
      });
    }
    if (typeof queryId !== "string") {
      return response.status(400).json({
        message: "assistantId must be a string",
      });
    }
    const assistantId = z
      .string()
      .ulid("The id must be a valid ulid string")
      .parse(queryId);
    const exists = await assistantExists(assistantId);
    if (!exists) {
      return response.status(404).json({
        message: "Assistant not found",
      });
    }
    await deleteMongoAssistant(assistantId);
    return response.status(200).send();
  } catch (e) {
    errorHandler(e, response);
  }
}
