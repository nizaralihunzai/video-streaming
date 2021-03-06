/*
 *
 * ListVideos reducer
 *
 */

import { fromJS } from 'immutable';
import {DEFAULT_ACTION, SET_DATA_ACTION } from './constants';
export const initialState = fromJS({
  videos_list: []
});

function listVideosReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    
    case SET_DATA_ACTION:
      return state.set('videos_list', action.payload);
      
    default:
      return state;
  }
}

export default listVideosReducer;
