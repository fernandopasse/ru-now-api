import mongoose from 'mongoose'

const LineVote = mongoose.model('LineVote', {
  vote: Number,
  userId: String,
  date: Date
})

export default LineVote
