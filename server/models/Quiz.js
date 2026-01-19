import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['MCQ', 'TRUE_FALSE', 'SHORT_ANSWER'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String
  }], // For MCQ
  correctAnswer: {
    type: String
  }, // For auto-grading, not sent to student
  marks: {
    type: Number,
    required: true,
    min: 0
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  resourceFile: {
    type: String // Path to uploaded PDF/Text file
  },
  assignedTo: {
    branch: {
      type: String,
      required: true
    },
    class: {
      type: String,
      required: true
    },
    section: {
      type: String,
      required: true
    }
  },
  questions: [questionSchema],
  config: {
    timeLimit: {
      type: Number, // in minutes
      required: true
    },
    shuffleQuestions: {
      type: Boolean,
      default: false
    },
    showResultsImmediately: {
      type: Boolean,
      default: true
    }
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'CLOSED'],
    default: 'DRAFT'
  }
}, {
  timestamps: true
});

// Indexes for faster queries
quizSchema.index({ teacher: 1 });
quizSchema.index({ "assignedTo.branch": 1, "assignedTo.class": 1, "assignedTo.section": 1 });
quizSchema.index({ status: 1 });

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
