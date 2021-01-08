import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterComponent } from './counter/counter.component';
import { CounterService } from './services/counter.service';
import { CountDiffInputDirective } from './commands/count-diff-input/count-diff-input.directive';
import { TickSpeedInputDirective } from './commands/tick-speed-input/tick-speed-input.directive';
import { SetToInputDirective } from './commands/set-to-input/set-to-input.directive';
import { CountDownBtnDirective } from './commands/count-down-btn/count-down-btn.directive';
import { CountUpBtnDirective } from './commands/count-up-btn/count-up-btn.directive';
import { SetToBtnDirective } from './commands/set-to-btn/set-to-btn.directive';
import { ResetBtnDirective } from './commands/reset-btn/reset-btn.directive';
import { PauseBtnDirective } from './commands/pause-btn/pause-btn.directive';
import { StartBtnDirective } from './commands/start-btn/start-btn.directive';
import { JsonValuePipe } from './pipes/json-value.pipe';



@NgModule({
  declarations: [
    CounterComponent,
    CountDiffInputDirective,
    TickSpeedInputDirective,
    SetToInputDirective,
    CountDownBtnDirective,
    CountUpBtnDirective,
    SetToBtnDirective,
    ResetBtnDirective,
    PauseBtnDirective,
    StartBtnDirective,
    JsonValuePipe,
  ],
  imports: [
    CommonModule
  ],
  providers:[
    CounterService,
  ],
  exports:[
    CounterComponent
  ]
})
export class CounterModule { }
