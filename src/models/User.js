import mongoose from 'mongoose'

const User = mongoose.model('User', {
  name: String,
  email: String,
  profileUrl: String,
  avatar: String,
  provider: String,
  facebook: {
    name: String,
    id: String
  }
})

export default User
