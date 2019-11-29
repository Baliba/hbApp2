import { Action } from '@ngrx/store';

export interface MediaAction extends Action {
  type: string;
  payload?: any;
}
export const CANPLAY = 'CANPLAY';
export const LOADEDMETADATA = 'LOADEDMETADATA';
export const PLAYING = 'PLAYING';
export const TIMEUPDATE = 'TIMEUPDATE';
export const LOADSTART = 'LOADSTART';
export const RESET = 'RESET';
export const STOP = 'STOP';