import {
  CreateEventLocationInput,
  EventLocation,
  UpdateEventLocationInput,
} from "../domain/event-location.domain";
import { eventLocationModel } from "./models/event-location.model";
import { ulid } from "ulid";

export async function createMongoEventLocation(
  input: CreateEventLocationInput,
) {
  const response = await eventLocationModel.create({
    ...input,
    locationId: ulid(),
  });

  return EventLocation.fromMongo(response);
}

export async function listMongoEventLocations() {
  const response = await eventLocationModel.find();

  return response.map((location) => EventLocation.fromMongo(location));
}

export async function getMongoEventLocationById(id: string) {
  const response = await eventLocationModel.findOne({ locationId: id });
  if (!response) throw new Error("Event location not found");
  return EventLocation.fromMongo(response);
}

export async function eventLocationExists(id: string) {
  return await eventLocationModel.exists({ locationId: id }).exec();
}

export async function updateMongoEventLocation(
  input: UpdateEventLocationInput,
) {
  const response = await eventLocationModel
    .findOneAndUpdate(
      {
        locationId: input.locationId,
      },
      input.input,
      { new: true },
    )
    .exec();
  return EventLocation.fromMongo(response);
}

export async function deleteMongoEventLocation(id: string) {
  await eventLocationModel.deleteOne({ locationId: id });
}
