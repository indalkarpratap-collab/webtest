const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true
    },
    question: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      default: 'mcq'
    },
    options: {
      type: [String],
      validate: {
        validator: (value) => Array.isArray(value) && value.length === 4,
        message: 'Each question must include exactly 4 options.'
      }
    },
    correctAnswer: {
      type: Number,
      min: 0,
      max: 3,
      required: true
    }
  },
  { _id: false }
);

const examSchema = new mongoose.Schema(
  {
    examTitle: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    duration: {
      type: Number,
      default: 60,
      min: 1
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: 'At least one question is required.'
      }
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.createdBy = ret.createdBy?.toString?.() || ret.createdBy;
        delete ret._id;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('Exam', examSchema);
