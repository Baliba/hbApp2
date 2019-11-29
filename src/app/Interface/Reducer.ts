import { MediaAction, CANPLAY, LOADEDMETADATA, PLAYING, TIMEUPDATE, LOADSTART, RESET, STOP } from  './MediaAction';

export function mediaStateReducer(state: any, action: MediaAction) {
  let payload = action.payload;
  switch (action.type) {
    case CANPLAY:
      state = Object.assign({}, state);
      state.media.canplay = payload.value;
      state.info=payload.mediaInfo;
      return state;
    case LOADEDMETADATA:
      state = Object.assign({}, state);
      state.media.loadedmetadata = payload.value;
      state.media.duration = payload.data.time;
      state.media.durationSec = payload.data.timeSec;
      state.media.mediaType = payload.data.mediaType;
      state.info=payload.mediaInfo;
      return state;
    case PLAYING:
      state = Object.assign({}, state);
      state.media.playing = payload.value;
      state.info.playing = payload.value;
      return state;
    case TIMEUPDATE:
      state = Object.assign({}, state);
      state.media.time = payload.time;
      state.media.timeSec = payload.timeSec;
      return state;
    case LOADSTART:
      state.media.loadstart = payload.value;
      state.info=payload.mediaInfo;
      return Object.assign({}, state);
    case RESET:
      state = Object.assign({}, state);
      state.media = {};
      state.info={};
      return state;
    default:
      state = {};
      state.media = {};
      state.info={};
      return state;
  }
}
