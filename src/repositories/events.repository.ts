import {
  AddAssistantToEventInput,
  AddCommentInput,
  CreateEventInput,
  Event,
  EventAggregateResult,
  UpdateEventMainData,
} from "../domain/event.domain";
import { eventModel } from "./models/event.model";
import { ulid } from "ulid";

const getEventAggregate = [
  {
    $lookup: {
      from: "event-locations",
      localField: "locationId",
      foreignField: "locationId",
      as: "eventLocation",
    },
  },
  {
    $lookup: {
      from: "assistants",
      localField: "assistants",
      foreignField: "assistantId",
      as: "eventAssistants",
    },
  },
];

export async function createMongoEvent(input: CreateEventInput) {
  const response = await eventModel.create({ ...input, eventId: ulid() });
  return response.toJSON();
}

export async function listAllMongoEvents() {
  const response = await eventModel
    .aggregate<EventAggregateResult>(getEventAggregate)
    .exec();
  return response.map((event) => Event.fromMongoEvent(event));
}

export async function getMongoEventById(id: string) {
  const response = await eventModel
    .aggregate<EventAggregateResult>([
      {
        $match: {
          eventId: id,
        },
      },
      ...getEventAggregate,
    ])
    .exec();
  if (response.length === 0 || response.length > 1) {
    throw new Error("There was an error trying to get the event by id");
  }
  return Event.fromMongoEvent(response[0]);
}

export async function eventExists(id: string) {
  return await eventModel.exists({ eventId: id }).exec();
}

export async function updateMongoEventData(input: UpdateEventMainData) {
  const { eventId, input: update } = input;
  await eventModel
    .updateOne(
      { eventId: eventId },
      {
        title: update.title,
        description: update.description,
        date: update.date,
        locationId: update.locationId,
      },
    )
    .exec();
  return await getMongoEventById(eventId);
}

export async function deleteMongoEvent(id: string) {
  return await eventModel.deleteOne({ eventId: id }).exec();
}

export async function addAssistantsToMongoEvent(
  input: AddAssistantToEventInput,
) {
  await eventModel
    .updateOne(
      {
        eventId: input.eventId,
      },
      {
        $addToSet: {
          assistants: {
            $each: input.newAssistance,
          },
        },
      },
    )
    .exec();
  return await getMongoEventById(input.eventId);
}

export async function removeAssistantFromMongoEvent(
  eventId: string,
  assistantId: string,
) {
  await eventModel
    .updateOne(
      { eventId },
      {
        $pull: {
          assistants: assistantId,
        },
      },
    )
    .exec();
  return await getMongoEventById(eventId);
}

export async function addCommentToMongoEvent(input: AddCommentInput) {
  await eventModel
    .updateOne(
      {
        eventId: input.eventId,
      },
      {
        $push: {
          comments: {
            assistantId: input.assistantId,
            comment: input.comment,
          },
        },
      },
    )
    .exec();
  return await getMongoEventById(input.eventId);
}
