import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, NgZone, ElementRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { CountDiffInputDirective } from '../commands/count-diff-input/count-diff-input.directive';
import { CountDownBtnDirective } from '../commands/count-down-btn/count-down-btn.directive';
import { CountUpBtnDirective } from '../commands/count-up-btn/count-up-btn.directive';
import { PauseBtnDirective } from '../commands/pause-btn/pause-btn.directive';
import { ResetBtnDirective } from '../commands/reset-btn/reset-btn.directive';
import { SetToBtnDirective } from '../commands/set-to-btn/set-to-btn.directive';
import { SetToInputDirective } from '../commands/set-to-input/set-to-input.directive';
import { StartBtnDirective } from '../commands/start-btn/start-btn.directive';
import { TickSpeedInputDirective } from '../commands/tick-speed-input/tick-speed-input.directive';
import { CounterService } from '../services/counter.service';
import { CommandsCounterI } from '../types/counter-service';



@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  providers: [CounterService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent implements OnInit, OnDestroy {
  counter: Subscription;

  @ViewChild(StartBtnDirective, { read: ElementRef,  static: true })
  btnStart: ElementRef;

  @ViewChild(PauseBtnDirective,  { read: ElementRef,  static: true })
  btnPause: ElementRef;

  @ViewChild(ResetBtnDirective,  { read: ElementRef,  static: true })
  btnReset: ElementRef;

  @ViewChild(SetToBtnDirective, { read: ElementRef,  static: true })
  btnSetTo: ElementRef;

  @ViewChild(CountUpBtnDirective,  { read: ElementRef,  static: true })
  btnCountUp: ElementRef;

  @ViewChild(CountDownBtnDirective,  { read: ElementRef,  static: true })
  btnCountDown: ElementRef;

  @ViewChild(SetToInputDirective,  { read: ElementRef,  static: true })
  inputSetTo: ElementRef;

  @ViewChild(TickSpeedInputDirective,  { read: ElementRef,  static: true })
  inputTickSpeed: ElementRef;

  @ViewChild(CountDiffInputDirective,  { read: ElementRef,  static: true })
  inputCountDiff: ElementRef;

  constructor(
    public counterServise: CounterService,
    private ngZone: NgZone,
    private el: ElementRef,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void { 
    const commands: CommandsCounterI = {
      btnStart: this.btnStart.nativeElement,
      btnPause: this.btnPause.nativeElement,
      btnCountDown: this.btnCountDown.nativeElement,
      btnCountUp: this.btnCountUp.nativeElement,
      btnReset: this.btnReset.nativeElement,
      inputCountDiff: this.inputCountDiff.nativeElement,
      inputTickSpeed: this.inputTickSpeed.nativeElement,
      setTo: {
        btnSetTo: this.btnSetTo.nativeElement,
        inputSetTo: this.inputSetTo.nativeElement
      }
    };

    this.ngZone.runOutsideAngular(() => {
      this.counter = this.counterServise.create(commands)
        .subscribe(() => this.cd.detectChanges());
    })  
  }

  cdCheck() {
    this.ngZone.runOutsideAngular(() => {
      const a = this.el.nativeElement.querySelector('a');
      a.classList.add("checked");
      setTimeout(() => {
          a.classList.remove("checked");
      }, 500);
    });
  }

  ngOnDestroy(): void { 
    this.counter.unsubscribe();
  }  
}


