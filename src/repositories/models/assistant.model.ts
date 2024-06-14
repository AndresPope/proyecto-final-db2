import { Document, model, Model, Schema } from "mongoose";

export enum IdentificationType {
  CC = "cc",
  NIT = "nit",
  TI = "ti",
  PA = "pa",
}

export enum TypeOfRelation {
  "TEACHER" = "teacher",
  "STUDENT" = "student",
  "GRADUATE" = "graduate",
  "BUSINESSMAN" = "businessman",
  "ADMINISTRATIVE" = "administrative",
  "MANAGER" = "manager",
  "UNKNOWN" = "unknown",
}

export interface MongoAssistant extends Document {
  assistantId: string;
  identificationType: IdentificationType;
  identification: string;
  fullName: string;
  username: string;
  typeOfRelation: TypeOfRelation;
  email: string;
  residence: string;
}

const assistantSchema = new Schema({
  assistantId: {
    type: String,
    require: true,
    unique: true,
  },
  identificationType: {
    type: String,
    require: true,
    enum: Object.values(IdentificationType),
  },
  identification: {
    type: String,
    require: true,
    unique: true,
  },
  fullName: {
    type: String,
    require: true,
  },
  username: {
    type: String,
    require: true,
  },
  typeOfRelation: {
    type: String,
    require: true,
    enum: Object.values(TypeOfRelation),
  },
  email: {
    type: String,
    require: true,
  },
  residence: {
    type: String,
    require: true,
  },
});

export interface AssistantModel extends Model<MongoAssistant> {}

export const assistantModel = model<MongoAssistant, AssistantModel>(
  "assistant",
  assistantSchema,
  "assistants",
);
