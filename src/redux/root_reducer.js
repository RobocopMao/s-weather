import { combineReducers } from 'redux'
import location from './location/reducer'
import user from './user/reducer'

export default combineReducers({
  location,
  user
})
