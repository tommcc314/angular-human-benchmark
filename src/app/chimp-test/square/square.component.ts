import { Component, input, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'Square',
  imports: [],
  templateUrl: './square.component.html',
  styleUrl: './square.component.css'
})
export class SquareComponent {
  id = input(0);
  totalSquares = input(0);
  displayMax = input(0);
  @Output() updateCurrSquare = new EventEmitter<number>();
  @Output() progress = new EventEmitter();
  changeParentValue() {
    this.updateCurrSquare.emit(this.id());
    this.progress.emit();
  }
}
