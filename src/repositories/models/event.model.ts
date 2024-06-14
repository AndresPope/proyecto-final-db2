import mongoose, { Document, Model, Schema } from "mongoose";

export interface Comment {
  assistantId: string;
  comment: string;
}

export interface Organizers {
  faculty: string;
  career?: string;
}

export interface MongoEvent extends Document {
  eventId: string;
  title: string;
  description: string;
  date: Date;
  comments: Array<Comment>;
  assistants: Array<string>;
  organizers: Array<Organizers>;
  categories: Array<string>;
  locationId: string;
}

const eventSchema = new Schema({
  eventId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  comments: [
    {
      assistantId: {
        type: String,
        required: true,
        ref: "assistant",
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  assistants: [
    {
      type: String,
      required: true,
      ref: "assistant",
    },
  ],
  organizers: [
    {
      faculty: {
        type: String,
        required: true,
      },
      career: {
        type: String,
      },
      _id: false,
    },
  ],
  categories: [
    {
      type: String,
      required: true,
    },
  ],
  locationId: {
    type: String,
    required: true,
    ref: "event-locations",
  },
});

export interface EventModel extends Model<MongoEvent> {}

export const eventModel = mongoose.model<MongoEvent, EventModel>(
  "Event",
  eventSchema,
  "event",
);
