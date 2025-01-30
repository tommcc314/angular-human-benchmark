import { Component, Signal, signal, OnInit } from '@angular/core';
import { SquareComponent } from '../square/square.component';

@Component({
  selector: 'app-board',
  imports: [SquareComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  gridsize = 40;
  initlevel = 5;
  maxstrikes = 3;

  strikes = 0;
  totalSquares = signal(this.initlevel);  // level
  displayMax = signal(this.initlevel);  // at start of level: all squares show, afterwards: equal to currSquare
  currSquare = signal(0);
  updateClickedSquare = (newValue: number) => {
    this.clickedSquare.set(newValue); // Updating the signal
    console.log("updated clicked square: ", this.clickedSquare())
  };
  clickedSquare = signal(0);
  gamestatus = signal<string>("not_started");
  squares = signal<number[]>([]);
  tempsquares: number[] = [];

  initGrid() {
    for (let i = 0; i < this.gridsize; i++) {
      this.tempsquares.push(i);
    }
    let currentIndex = this.tempsquares.length;

    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [this.tempsquares[currentIndex], this.tempsquares[randomIndex]] = [
        this.tempsquares[randomIndex], this.tempsquares[currentIndex]];
    }
    this.squares.set(this.tempsquares);
    this.tempsquares = [];
  }
  progress() {
    switch (this.gamestatus()) {
      case "not_started":
        this.gamestatus.set("between_levels");
        break;
      case"between_levels":
        this.initGrid();
        this.displayMax.set(this.totalSquares());
        this.currSquare.set(0);
        this.gamestatus.set("level_start");
        break;
      case "level_start":
        if (this.clickedSquare() > this.currSquare()) {
          this.strikes += 1;
          if (this.strikes == this.maxstrikes) this.gamestatus.set("game_over");
          else this.gamestatus.set("between_levels");
        }
        else {
          this.currSquare.set(this.currSquare() + 1);
          this.displayMax.set(this.currSquare());
          this.gamestatus.set("in_progress");
        }
        break;
      case "in_progress":
        if (this.clickedSquare() > this.currSquare()) {
          this.strikes += 1;
          if (this.strikes == this.maxstrikes) this.gamestatus.set("game_over");
          else this.gamestatus.set("between_levels");
        }
        else {
          this.currSquare.set(this.currSquare() + 1);
          if (this.currSquare() == this.totalSquares()) {
            this.totalSquares.set(this.totalSquares() + 1);
            this.gamestatus.set("between_levels");
          }
          else this.displayMax.set(this.currSquare());
        }
        break;
      case "game_over":
        this.totalSquares.set(this.initlevel);
        this.strikes = 0;
        this.gamestatus.set("between_levels");
    }
  }

}
