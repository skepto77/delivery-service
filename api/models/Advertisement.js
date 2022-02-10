import mongoose from 'mongoose';

const advertisementSchema = mongoose.Schema({
  shortText: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  images: {
    type: [String],
    required: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: new Date(+new Date() + 1000 * 60),
  },
  tags: {
    type: [String],
    required: false,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Advertisement = mongoose.model('Advertisement', advertisementSchema);

export default Advertisement;
