import { Request, Response } from "express";
import {
  addAssistantToEventSchema,
  addCommentSchema,
  createEventInputSchema,
  updateEventMainDataSchema,
} from "../domain/event.domain";
import {
  addAssistantsToMongoEvent,
  addCommentToMongoEvent,
  createMongoEvent,
  deleteMongoEvent,
  eventExists,
  getMongoEventById,
  listAllMongoEvents,
  removeAssistantFromMongoEvent,
  updateMongoEventData,
} from "../repositories/events.repository";
import _ from "lodash";
import { errorHandler } from "../domain/handler.error";
import { z } from "zod";

export async function createEvent(request: Request, response: Response) {
  try {
    const body = request.body;
    if (_.isEmpty(body)) {
      return response.status(400).json({
        message: "Missing body",
      });
    }
    const input = createEventInputSchema.parse(body);
    const event = await createMongoEvent(input);
    return response.json(event);
  } catch (e) {
    errorHandler(e, response);
  }
}

export async function listAllEvents(_request: Request, response: Response) {
  try {
    const events = await listAllMongoEvents();
    return response.json(events.map((event) => event.toJson()));
  } catch (e) {
    errorHandler(e, response);
  }
}

export async function getEventById(request: Request, response: Response) {
  try {
    const queryId = request.query.id;
    if (!queryId) {
      return response.status(400).json({
        message: "Missing eventId",
      });
    }
    if (typeof queryId !== "string") {
      return response.status(400).json({
        message: "eventId must be a string",
      });
    }
    const eventId = z
      .string()
      .ulid("The id must be a valid ulid string")
      .parse(queryId);
    const event = await getMongoEventById(eventId);
    return response.json(event.toJson());
  } catch (e) {
    errorHandler(e, response);
  }
}

export async function updateEventData(request: Request, response: Response) {
  try {
    const body = request.body;
    if (_.isEmpty(body)) {
      return response.status(400).json({
        message: "Missing body",
      });
    }
    const updateInput = updateEventMainDataSchema.parse(body);
    const exists = await eventExists(updateInput.eventId);
    if (!exists) {
      return response.status(404).json({
        message: "Event not found",
      });
    }
    const event = await updateMongoEventData(updateInput);
    return response.json(event.toJson());
  } catch (e) {
    errorHandler(e, response);
  }
}

export async function deleteEvent(request: Request, response: Response) {
  try {
    const queryId = request.query.id;
    if (!queryId) {
      return response.status(400).json({
        message: "Missing eventId",
      });
    }
    if (typeof queryId !== "string") {
      return response.status(400).json({
        message: "eventId must be a string",
      });
    }
    const eventId = z
      .string()
      .ulid("The id must be a valid ulid string")
      .parse(queryId);
    const exists = await eventExists(eventId);
    if (!exists) {
      return response.status(404).json({
        message: "Event not found",
      });
    }
    const result = await deleteMongoEvent(eventId);
    return response.json(result);
  } catch (e) {
    errorHandler(e, response);
  }
}

export async function addAssistantToEvent(
  request: Request,
  response: Response,
) {
  try {
    const body = request.body;
    if (_.isEmpty(body)) {
      return response.status(400).json({
        message: "Missing body",
      });
    }
    const validatedInput = addAssistantToEventSchema.parse(body);
    const exists = await eventExists(validatedInput.eventId);
    if (!exists) {
      return response.status(404).json({
        message: "Event not found",
      });
    }
    const event = await addAssistantsToMongoEvent(validatedInput);
    return response.json(event.toJson());
  } catch (e) {
    errorHandler(e, response);
  }
}

export async function removeAssistantFromEvent(
  request: Request,
  response: Response,
) {
  try {
    const body = request.body;
    if (_.isEmpty(body)) {
      return response.status(400).json({
        message: "Missing body",
      });
    }
    const validatedInput = z
      .object({
        eventId: z
          .string({
            required_error: "EventId is required",
          })
          .ulid("The id must be a valid ulid string"),
        assistantId: z
          .string({
            required_error: "AssistantId is required",
          })
          .ulid("The id must be a valid ulid string"),
      })
      .parse(body);
    const exists = await eventExists(validatedInput.eventId);
    if (!exists) {
      return response.status(404).json({
        message: "Event not found",
      });
    }
    const event = await removeAssistantFromMongoEvent(
      validatedInput.eventId,
      validatedInput.assistantId,
    );
    return response.json(event.toJson());
  } catch (e) {
    errorHandler(e, response);
  }
}

export async function addCommentToEvent(request: Request, response: Response) {
  try {
    const body = request.body;
    if (_.isEmpty(body)) {
      return response.status(400).json({
        message: "Missing body",
      });
    }
    const validatedInput = addCommentSchema.parse(body);
    const exists = await eventExists(validatedInput.eventId);
    if (!exists) {
      return response.status(404).json({
        message: "Event not found",
      });
    }
    const event = await addCommentToMongoEvent(validatedInput);
    return response.json(event.toJson());
  } catch (e) {
    errorHandler(e, response);
  }
}
