import { z } from "zod";
import { MongoEventLocation as EventLocationDocument } from "../repositories/models/event-location.model";

export const createEventLocationSchema = z.object({
  name: z.string({
    required_error: "LocationName is required",
  }),
  city: z.string({
    required_error: "City is required",
  }),
  state: z.string({
    required_error: "State is required",
  }),
  country: z.string({
    required_error: "Country is required",
  }),
  address: z.string({
    required_error: "Address is required",
  }),
});

export const updateEventLocationSchema = z.object({
  locationId: z
    .string({
      required_error: "LocationId is required",
    })
    .ulid("The id must be a valid ulid string"),
  input: createEventLocationSchema,
});

export type UpdateEventLocationInput = z.infer<
  typeof updateEventLocationSchema
>;

export type CreateEventLocationInput = z.infer<
  typeof createEventLocationSchema
>;

export class EventLocation {
  private constructor(
    public readonly locationId: string,
    public readonly name: string,
    public readonly city: string,
    public readonly state: string,
    public readonly country: string,
    public readonly address: string,
  ) {}

  static fromMongo(document: EventLocationDocument) {
    return new EventLocation(
      document.locationId,
      document.name,
      document.city,
      document.state,
      document.country,
      document.address,
    );
  }

  public toJSON() {
    return {
      locationId: this.locationId,
      name: this.name,
      city: this.city,
      state: this.state,
      country: this.country,
      address: this.address,
    };
  }
}
