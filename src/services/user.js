import { randomBytes } from "crypto";

import { User } from "../models/init.js";
import DatabaseError from "../models/error.js";
import { generatePasswordHash, validatePassword } from "../utils/password.js";

const generateRandomToken = () =>
  randomBytes(48).toString("base64").replace(/[+/]/g, ".");

class UserService {
  static async list() {
    try {
      const users = await User.findMany();
      return users.map((u) => ({ ...u, password: undefined }));
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      const user = await User.findUnique({
        where: { id },
      });

      if (!user) return null;

      delete user.password;
      return user;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return User.update(
        {
          where: { id },
        },
        {
          data,
        }
      );
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      return User.delete({
        where: { id },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async authenticateWithPassword(email, password) {
    try {
      const user = await User.findUnique({
        where: { email },
      });
      if (!user) return null;

      const passwordValid = await validatePassword(password, user.password);

      if (!passwordValid) return null;

      user.lastLoginAt = Date.now();
      const updatedUser = await User.update({
        where: { id: user.id },
        data: { lastLoginAt: user.lastLoginAt },
      });

      delete updatedUser.password;
      return updatedUser;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async authenticateWithToken(token) {
    try {
      const user = await User.findUnique({
        where: { token },
      });
      if (!user) return null;

      delete user.password;
      return user;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async createUser({ password, ...userData }) {
    const hash = await generatePasswordHash(password);

    try {
      const data = {
        ...userData,
        password: hash,
        token: generateRandomToken(),
      };

      const user = await User.create({ data });

      delete user.password;
      return user;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async setPassword(user, password) {
    user.password = await generatePasswordHash(password); // eslint-disable-line

    try {
      if (user.id) {
        return User.update({
          where: { id: user.id },
          data: { password: user.password },
        });
      }

      return user;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async regenerateToken(user) {
    user.token = generateRandomToken(); // eslint-disable-line

    try {
      if (user.id) {
        return User.update({
          where: { id: user.id },
          data: { password: user.password },
        });
      }

      return user;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default UserService;
