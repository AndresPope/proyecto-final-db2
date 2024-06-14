import { z } from "zod";
import {
  IdentificationType,
  MongoAssistant,
  TypeOfRelation,
} from "../repositories/models/assistant.model";

export const createAssistantInputSchema = z.object({
  identificationType: z.nativeEnum(IdentificationType, {
    message: "Invalid identification type",
  }),
  identification: z.string({
    required_error: "identification is required",
  }),
  fullName: z.string({
    required_error: "fullName is required",
  }),
  username: z.string({
    required_error: "username is required",
  }),
  typeOfRelation: z.nativeEnum(TypeOfRelation, {
    message: "Invalid type of relation",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid Syntax of email"),
  residence: z.string({
    required_error: "residence is required",
  }),
});

export const updateAssistantInputSchema = z.object({
  assistantId: z
    .string({
      required_error: "Assistant id is required",
    })
    .ulid("Invalid assistant id"),
  input: createAssistantInputSchema,
});

export type UpdateAssistantInput = z.infer<typeof updateAssistantInputSchema>;

export type CreateAssistantInput = z.infer<typeof createAssistantInputSchema>;

export class Assistant {
  private constructor(
    public readonly assistantId: string,
    public readonly identificationType: IdentificationType,
    public readonly identification: string,
    public readonly fullName: string,
    public readonly username: string,
    public readonly typeOfRelation: TypeOfRelation,
    public readonly email: string,
    public readonly residence: string,
  ) {}

  public static fromMongo(response: MongoAssistant): Assistant {
    return new Assistant(
      response.assistantId,
      response.identificationType,
      response.identification,
      response.fullName,
      response.username,
      response.typeOfRelation,
      response.email,
      response.residence,
    );
  }

  public toJSON() {
    return {
      assistantId: this.assistantId,
      identificationType: this.identificationType,
      identification: this.identification,
      fullName: this.fullName,
      username: this.username,
      typeOfRelation: this.typeOfRelation,
      email: this.email,
      residence: this.residence,
    };
  }
}
