const EventModel = require("../models/Event");

module.exports.saveEvent = async (event) => {
  let newEvent = new EventModel({
    name: event.name,
    payload: event.payload,
  });

  newEvent = await newEvent.save();

  return newEvent;
};

module.exports.getEvents = async (eventName, recipientId) => {
  const events = await EventModel.find({
    name: eventName,
    "payload.to": recipientId,
  });
  return events;
};

module.exports.deleteEvents = async (eventName, recipientId) => {
  const eventsCount = await EventModel.deleteMany({
    name: eventName,
    "payload.to": recipientId,
  });
  return eventsCount;
};
