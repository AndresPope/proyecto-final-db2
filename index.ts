import express from "express";
import mongoose from "mongoose";
import {
  addAssistantToEvent,
  addCommentToEvent,
  createEvent,
  deleteEvent,
  getEventById,
  listAllEvents,
  removeAssistantFromEvent,
  updateEventData,
} from "./src/functions/event.functions";
import {
  createEventLocation,
  deleteEventLocation,
  getEventLocationById,
  listEventLocations,
  updateEventLocation,
} from "./src/functions/event-location.functions";
import {
  createAssistant,
  deleteAssistant,
  getAssistantById,
  listAllRegisteredAssistants,
  updateAssistant,
} from "./src/functions/assistant.functions"; // Create Express App - Configure

// Create Express App - Configure

const app = express();

app.use(express.json());

const mongoUri =
  "mongodb://acuasmart-mongo-user:acuasmart-mongo-password@localhost:27017/db-mongo-proyect?authSource=admin";

const port = 4000;

app.get("/", (req, res) => {
  res.send("<h1>Proyecto Final Bases de Datos 2</h1>");
});

// Event Routes

app.post("/create-event", createEvent);
app.get("/list-all-events", listAllEvents);
app.get("/get-event-by-id", getEventById);
app.put("/update-event-main-data", updateEventData);
app.delete("/delete-event", deleteEvent);
app.put("/add-assistant-to-event", addAssistantToEvent);
app.put("/remove-assistant-from-event", removeAssistantFromEvent);
app.put("/add-comment", addCommentToEvent);

// Assistant Routes

app.post("/create-assistant", createAssistant);
app.get("/list-all-assistants", listAllRegisteredAssistants);
app.get("/get-assistant-by-id", getAssistantById);
app.put("/update-assistant", updateAssistant);
app.delete("/delete-assistant", deleteAssistant);

// Event Location Routes

app.get("/list-event-locations", listEventLocations);
app.get("/event-location", getEventLocationById);
app.post("/create-event-location", createEventLocation);
app.put("/update-event-location", updateEventLocation);
app.delete("/delete-event-location", deleteEventLocation);

// Start Application

mongoose
  .connect(mongoUri, {
    dbName: "db-mongo-proyect",
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`🚀 Server Ready at http//localhost:${port} 🚀`);
    });
  });
