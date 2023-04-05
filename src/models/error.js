class DatabaseError extends Error {
  constructor(prismaError) {
    super(prismaError.message);
    this.code = prismaError.code;
    this.details = prismaError.meta;
  }

  isClientError() {
    return this.code.startsWith("P2");
  }
}

export default DatabaseError;
