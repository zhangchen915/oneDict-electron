import {animate, state, style, transition, trigger} from '@angular/animations';

export const HomeAnimation = trigger('openClose', [
  state('0', style({
    height: '20%',
  })),
  state('1', style({
    height: '100%',
  })),
  state('2', style({
    height: '20%',
  })),
  transition('* => *', [
    animate('.25s')
  ])
]);
