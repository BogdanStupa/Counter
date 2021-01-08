import { Observable } from "rxjs";
import { FromEventTarget } from "rxjs/internal/observable/fromEvent";

export type PartialCountDownState = 
  { isTicking: boolean } | 
  { count: number } | 
  { countUp: boolean } |
  { tickSpeed: number } |
  { countDiff:number};

export type ValueType<T> = T extends { [key: string]: infer U } ? U : never; 

export interface CountDownState {
  isTicking: boolean;
  count: number; 
  countUp: boolean;
  tickSpeed: number;
  countDiff:number;
  setTo: number;
}

interface SetToI {
  btnSetTo: FromEventTarget<MouseEvent>;
  inputSetTo: FromEventTarget<Event>;
}

export interface CommandsCounterI {
  btnStart: FromEventTarget<MouseEvent>;
  btnPause: FromEventTarget<MouseEvent>,
  btnReset?: FromEventTarget<MouseEvent>; 
  btnCountUp?: FromEventTarget<MouseEvent>;
  btnCountDown?:FromEventTarget<MouseEvent>;
  setTo?: SetToI;
  inputTickSpeed?:FromEventTarget<InputEvent>;
  inputCountDiff?: FromEventTarget<InputEvent>;
}

export interface CommandCounterEventsI {
  btnStart$: Observable<PartialCountDownState>;
  btnPause$: Observable<PartialCountDownState>,
  btnReset$?: Observable<PartialCountDownState>; 
  btnCountUp$?: Observable<PartialCountDownState>;
  btnCountDown$?: Observable<PartialCountDownState>;
  btnSetTo$: Observable<PartialCountDownState>;
  inputTickSpeed$?:Observable<PartialCountDownState>;
  inputCountDiff$?: Observable<PartialCountDownState>;
}

export interface CommandTickI{
  count: number;
  countDiff: number;
  countUp: boolean;
}