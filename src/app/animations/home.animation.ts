import {animate, state, style, transition, trigger} from '@angular/animations';

export const HomeAnimation = trigger('openClose', [
  state('0', style({
    height: '60%',
  })),
  state('1', style({
    height: '100%',
  })),
  state('2', style({
    height: '20%',
  })),
  transition('0 => 1', [
    animate('.5s')
  ]),
  transition('1 => 2', [
    animate('.25s')
  ]),
  transition('2 => 1', [
    animate('.5s')
  ]),
  transition('2 => 0', [
    animate('.5s')
  ]),
]);
