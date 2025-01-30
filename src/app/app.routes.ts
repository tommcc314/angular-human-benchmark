import { Routes } from '@angular/router';
import { ReactionTimeComponent } from './reaction-time/reaction-time.component';
import { BoardComponent } from './chimp-test/board/board.component';

export const routes: Routes = [
    { path: 'reactiontime', component: ReactionTimeComponent },
    { path: 'chimp-test', component: BoardComponent}
];
