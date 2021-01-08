import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, fromEvent, merge, NEVER, Observable, pipe, Subject, timer, UnaryFunction } from 'rxjs';
import { mapTo, withLatestFrom, map, startWith, scan, shareReplay, switchMap, tap, pluck, distinctUntilChanged, filter } from 'rxjs/operators';
import { CommandCounterEventsI, CommandsCounterI, CommandTickI, CountDownState, PartialCountDownState, ValueType } from '../types/counter-service';



@Injectable()
export class CounterService {
  private initialCounterState: CountDownState = {
    count: 0,
    isTicking: false, 
    tickSpeed: 200,
    countUp: true, 
    countDiff: 1,
    setTo: 10
  };
  private state: BehaviorSubject<CountDownState> = new BehaviorSubject(this.initialCounterState); 
  public counter = this.state.asObservable();

  constructor() { }

  public create(commands: CommandsCounterI): Observable<any> {
    const eventCommands: CommandCounterEventsI = this.initEvents(commands);
    const counterSubject = new Subject<PartialCountDownState>();

    const counterCommands$: Observable<PartialCountDownState> = merge(
      ...Object.values(eventCommands),
      counterSubject.asObservable()
    );

    const counterState$ = counterCommands$
      .pipe(
        startWith(this.initialCounterState),
        scan((counterState: CountDownState, command: PartialCountDownState | CountDownState): CountDownState => {
          this.state.next({...counterState, ...command });
          return {...counterState, ...command }
        }),
        shareReplay(1)
      );

    const isTicking$ = counterState$.pipe(this.queryChange<CountDownState, boolean>("isTicking"));
    const tickSpeed$ = counterState$.pipe(this.queryChange<CountDownState, number>("tickSpeed"));
    
    const counterUpdateTrigger$ = combineLatest([isTicking$, tickSpeed$])
      .pipe(
        switchMap(([isTicking, tickSpeed]) => isTicking ? timer(0, tickSpeed) : NEVER)
      );

    const commandFromTick$ = counterUpdateTrigger$
      .pipe(
        withLatestFrom(counterState$,(_, counterState: CountDownState):CommandTickI => ({
          count: counterState.count,
          countUp: counterState.countUp,
          countDiff: counterState.countDiff
        })),
        tap(({ count, countUp, countDiff }) => counterSubject.next({ count: count + countDiff * ( countUp ? 1 : -1 ) })),      
      );

    return merge(commandFromTick$, counterState$);
  }

  private initEvents(commands: CommandsCounterI): CommandCounterEventsI {
    return {
      btnStart$: fromEvent(commands.btnStart, "click").pipe(mapTo({ isTicking: true })),
      btnPause$: fromEvent(commands.btnPause, "click").pipe(mapTo({ isTicking: false })),
      btnReset$: fromEvent(commands.btnReset, "click").pipe(mapTo({ ...this.initialCounterState })),
      btnCountDown$: fromEvent(commands.btnCountDown, "click").pipe(mapTo({ countUp: false })),
      btnCountUp$: fromEvent(commands.btnCountUp, "click").pipe(mapTo({ countUp: true })),
      btnSetTo$: fromEvent(commands.setTo.btnSetTo, "click").pipe(
        withLatestFrom(this.getCommandInputObservable(fromEvent(commands.setTo.inputSetTo, "input"), this.initialCounterState.setTo)),
        filter(([_, count]) => !!count),
        map(([_, count]) => ({ count } as PartialCountDownState))
      ),
      inputCountDiff$: this.getCommandInputObservable(fromEvent(commands.inputCountDiff, "input"), this.initialCounterState.countDiff).pipe(
        filter(countDiff =>  !!countDiff),
        map(countDiff => ({ countDiff  } as PartialCountDownState ))
      ),
      inputTickSpeed$: this.getCommandInputObservable(fromEvent(commands.inputTickSpeed, "input"), this.initialCounterState.tickSpeed).pipe(
        map(tickSpeed => ({ tickSpeed } as PartialCountDownState))
      )
    }
  } 

  private getCommandInputObservable(observable: Observable<Event>, initialValue: ValueType<PartialCountDownState>):Observable<ValueType<PartialCountDownState>>{
    return observable.pipe(
      map(event => (event.target as HTMLInputElement).value),
      map(v => parseInt(v)),
      startWith(initialValue)
    );
  }

  private queryChange<T, I>(key: string): UnaryFunction<Observable<T>, Observable<I>> {
    return  pipe(
      pluck<T, I>(key), 
      distinctUntilChanged<I>()
    );
  }
}


