import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'reaction-time',
  imports: [],
  templateUrl: './reaction-time.component.html',
  styleUrl: './reaction-time.component.css'
})

export class ReactionTimeComponent {
  // configs
  STATUS_TO_COLOR: Map<string, string> = new Map([
    ["not_started", "lightblue"],
    ["ended", "lightblue"],
    ["between_rounds", "lightblue"],
    ["invalid_click", "lightblue"],
    ["before_change", "red"],
    ["after_change", "green"]
  ]);
  ROUNDS_PER_GAME = 5;

  times: Array<number> = new Array();
  avgTime: number = 0;
  tempstarttime: number = 0;
  wait: number = 0;
  timeoutId: any = 0;
  
  gamestatus = signal<string>("not_started");
  round = signal<number>(1);
  boxcolor = computed(() => this.STATUS_TO_COLOR.get(this.gamestatus()));
  
  startTest() {
    this.wait = Math.random() * 3000 + 2000;
    this.timeoutId = setTimeout(() => {
        this.gamestatus.set("after_change");
        this.tempstarttime = Date.now();
    }, this.wait);
    // console.log("timeoutId: ", this.timeoutId);
  }
  resetTest() {
    if (this.timeoutId) {
      // console.log("clearing timeoutId: ", this.timeoutId);
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
  getAvgTime() {
    this.avgTime = this.times.reduce((a, b) => a + b) / this.times.length;
    return this.avgTime;
  }
  progress() {
    switch (this.gamestatus()) {
      case "not_started":
        this.gamestatus.set("before_change");
        this.startTest();
        break;
      case "before_change":
        this.resetTest();
        this.gamestatus.set("invalid_click");
        break;
      case"after_change":
        this.times.push(Date.now() - this.tempstarttime);
        if (this.round() >= this.ROUNDS_PER_GAME) {
          this.gamestatus.set("ended")
        }
        else {
          this.gamestatus.set("between_rounds");
        }
        break;
      case "between_rounds":
        this.round.set(this.round() + 1);
        this.gamestatus.set("before_change");
        this.startTest();
        break;
      case "ended":
        this.round.set(1);
        this.gamestatus.set("not_started");
        break;
      case "invalid_click":
        this.gamestatus.set("before_change");
        this.startTest();
        break;
    }
  }
}
