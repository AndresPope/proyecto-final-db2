import { Document, model, Model, Schema } from "mongoose";

export interface MongoEventLocation extends Document {
  locationId: string;
  name: string;
  city: string;
  state: string;
  country: string;
  address: string;
}

const eventLocationSchema = new Schema({
  locationId: {
    type: String,
    require: true,
    unique: true,
  },
  name: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
  state: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
});

export interface EventLocationModel extends Model<MongoEventLocation> {}

export const eventLocationModel = model<MongoEventLocation, EventLocationModel>(
  "eventLocation",
  eventLocationSchema,
  "event-locations",
);
