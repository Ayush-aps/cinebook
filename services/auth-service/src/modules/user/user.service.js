import { User } from '../../models/User.js';

export const userService = {
  async updateProfile(userId, userData) {
    const updated = await User.update(userId, userData);
    if (!updated) {
      throw new Error('User not found');
    }
    return await User.findById(userId);
  }
};