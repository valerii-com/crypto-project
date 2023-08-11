import process from 'process';
import { Buffer } from 'buffer';
import EventEmitter from 'events';

export const polyfillNode = () => {
  window.Buffer = Buffer;
  window.process = process;
  window.EventEmitter = EventEmitter;
};
