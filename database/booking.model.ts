import { Schema, model, models, Document, Types } from 'mongoose';
import Event from './event.model';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true, // Index for faster queries
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          // RFC 5322 compliant email regex (simplified)
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook to validate event existence
 * - Verifies that the referenced eventId corresponds to an existing Event
 * - Throws an error if the event does not exist in the database
 */
BookingSchema.pre('save', async function (next) {
  // Only validate eventId if it's new or modified
  if (this.isModified('eventId')) {
    try {
      const eventExists = await Event.findById(this.eventId);

      if (!eventExists) {
        return next(new Error('Referenced event does not exist'));
      }
    } catch (error) {
      return next(new Error('Failed to validate event reference'));
    }
  }

  next();
});

// Prevent model recompilation in development (Next.js hot reload)
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
