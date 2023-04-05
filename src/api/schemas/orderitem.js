export default {
  type: "object",
  properties: {
    order: { type: "integer" },
    product: { type: "integer" },
    price: { type: "number" },
  },
  required: ["order", "product", "price"],
  additionalProperties: false,
};
