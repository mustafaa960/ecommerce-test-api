export default {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    price: { type: "number" },
    category: { type: "integer" },
  },
  required: ["name", "description", "price", "category"],
  additionalProperties: false,
};
