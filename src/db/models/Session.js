import { model, Schema } from 'mongoose';

const sessionsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, //це Id користувача,id у mongoDB-це окремий тип даних,тому замість string пишемо так
      ref: 'users',
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const SessionsCollection = model('session', sessionsSchema);
