export default {
  type: "object",
  properties: {
    user: { type: "integer" },
    createdAt: { type: "string", format: "date-time" },
    paid: { type: "boolean" },
  },
  required: ["user", "createdAt", "paid"],
  additionalProperties: false,
};
