import mongoose from 'mongoose'

const User = mongoose.model('User', {
  name: String,
  username: String,
  access_token: String,
  provider: String,
  facebook: {
    name: String,
    id: String
  }
})

export default User
