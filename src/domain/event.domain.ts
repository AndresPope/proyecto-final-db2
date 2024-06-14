import { z } from "zod";
import { MongoAssistant } from "../repositories/models/assistant.model";
import { MongoEventLocation } from "../repositories/models/event-location.model";
import {
  Comment,
  MongoEvent,
  Organizers,
} from "../repositories/models/event.model";
import { EventLocation } from "./event-location.domain";
import { Assistant } from "./assistant.domain";

export const organizersSchema = z.object({
  faculty: z.string({
    required_error: "Faculty is required",
  }),
  career: z.string().optional(),
});

export const createEventInputSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
  date: z
    .string({
      required_error: "Date is required",
    })
    .date("Invalid date"),
  assistants: z
    .array(z.string(), {
      required_error: "Assistants is required",
    })
    .min(0),
  organizers: z
    .array(organizersSchema, {
      required_error: "Organizers are required",
    })
    .min(1, "At least one organizer is required"),
  categories: z
    .array(z.string(), {
      required_error: "Categories are required",
    })
    .min(1, "At least one category is required"),
  locationId: z
    .string({
      required_error: "Location ID is required",
    })
    .ulid("Invalid location ID"),
});

export const updateEventMainDataSchema = z.object({
  eventId: z
    .string({
      required_error: "Event ID is required",
    })
    .ulid("Invalid event ID"),
  input: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    date: z
      .string({
        required_error: "Date is required",
      })
      .date("Invalid date"),
    locationId: z
      .string({
        required_error: "Location ID is required",
      })
      .ulid("Invalid location ID"),
  }),
});

export const addAssistantToEventSchema = z.object({
  eventId: z
    .string({
      required_error: "EventId is required",
    })
    .ulid("The id must be a valid ulid string"),
  newAssistance: z.array(z.string()).min(1),
});

export const addCommentSchema = z.object({
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
  comment: z.string({
    required_error: "Comment is required",
  }),
});

export type AddCommentInput = z.infer<typeof addCommentSchema>;
export type AddAssistantToEventInput = z.infer<
  typeof addAssistantToEventSchema
>;
export type CreateEventInput = z.infer<typeof createEventInputSchema>;
export type UpdateEventMainData = z.infer<typeof updateEventMainDataSchema>;

export interface EventAggregateResult extends MongoEvent {
  eventLocation: MongoEventLocation[];
  eventAssistants: MongoAssistant[];
}

export class Event {
  private constructor(
    public readonly eventId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly date: Date,
    public readonly comments: Array<Comment>,
    public readonly assistants: Array<string>,
    public readonly organizers: Array<Organizers>,
    public readonly categories: Array<string>,
    public readonly locationId: string,
    public readonly location: EventLocation,
    public readonly eventAssistants: Array<Assistant>,
  ) {}

  static fromMongoEvent(event: EventAggregateResult): Event {
    if (event.eventLocation.length === 0 || event.eventLocation.length > 1) {
      throw new Error("Event has no location");
    }
    return new Event(
      event.eventId,
      event.title,
      event.description,
      event.date,
      event.comments,
      event.assistants,
      event.organizers,
      event.categories,
      event.locationId,
      EventLocation.fromMongo(event.eventLocation[0]),
      event.eventAssistants.map((assistant) => Assistant.fromMongo(assistant)),
    );
  }

  public toJson() {
    return {
      eventId: this.eventId,
      title: this.title,
      description: this.description,
      date: this.date,
      comments: this.comments,
      assistants: this.assistants,
      organizers: this.organizers,
      categories: this.categories,
      locationId: this.locationId,
      location: this.location.toJSON(),
      eventAssistants: this.eventAssistants.map((assistant) =>
        assistant.toJSON(),
      ),
    };
  }
}
