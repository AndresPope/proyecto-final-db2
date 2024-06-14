import { Request, Response } from "express";
import {
  createEventLocationSchema,
  EventLocation,
  updateEventLocationSchema,
} from "../domain/event-location.domain";
import {
  createMongoEventLocation,
  deleteMongoEventLocation,
  eventLocationExists,
  getMongoEventLocationById,
  listMongoEventLocations,
  updateMongoEventLocation,
} from "../repositories/event-location.repository";
import _ from "lodash";
import { errorHandler } from "../domain/handler.error";
import { z } from "zod";

export async function createEventLocation(
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
    const input = createEventLocationSchema.parse(body);
    const eventLocation = await createMongoEventLocation(input);
    return response.json(eventLocation.toJSON());
  } catch (e) {
    errorHandler(e, response);
  }
}

export async function listEventLocations(
  _request: Request,
  response: Response,
) {
  try {
    const eventLocations: EventLocation[] = await listMongoEventLocations();
    return response.json(eventLocations.map((location) => location.toJSON()));
  } catch (e) {
    errorHandler(e, response);
  }
}

export async function getEventLocationById(
  request: Request,
  response: Response,
) {
  try {
    const queryId = request.query.id;
    if (!queryId) {
      return response.status(400).json({
        message: "Missing event location id",
      });
    }
    if (typeof queryId !== "string") {
      return response.status(400).json({
        message: "Event location id must be a string",
      });
    }
    const locationId = z
      .string()
      .ulid("The id must be a valid ulid string")
      .parse(queryId);
    const eventLocation = await getMongoEventLocationById(locationId);
    return response.json(eventLocation.toJSON());
  } catch (e) {
    errorHandler(e, response);
  }
}

export async function updateEventLocation(
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
    const updateInput = updateEventLocationSchema.parse(body);
    const locationExists = await eventLocationExists(updateInput.locationId);
    if (!locationExists) {
      return response.status(404).json({
        message: "Event location not found",
      });
    }
    const eventLocation = await updateMongoEventLocation(updateInput);
    return response.json(eventLocation.toJSON());
  } catch (e) {
    errorHandler(e, response);
  }
}

export async function deleteEventLocation(
  request: Request,
  response: Response,
) {
  try {
    const queryId = request.query.id;
    if (!queryId) {
      return response.status(400).json({
        message: "Missing event location id",
      });
    }
    if (typeof queryId !== "string") {
      return response.status(400).json({
        message: "Event location id must be a string",
      });
    }
    const locationId = z
      .string()
      .ulid("The id must be a valid ulid string")
      .parse(queryId);
    const locationExists = await eventLocationExists(locationId);
    if (!locationExists) {
      return response.status(404).json({
        message: "Event location not found",
      });
    }
    await deleteMongoEventLocation(locationId);
    return response.status(200).send();
  } catch (e) {
    errorHandler(e, response);
  }
}
