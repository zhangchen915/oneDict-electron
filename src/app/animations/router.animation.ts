import {trigger, transition, group, query, style, animate} from '@angular/animations';

export const RouterAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    group([
      query(':enter', [
        style({transform: 'translateY({{offsetEnter}}%)'}),
        animate('0.4s ease-in-out', style({transform: 'translateY(0%)'}))
      ], {optional: true}),
      query(':leave', [
        style({transform: 'translateY(0%)'}),
        animate('0.4s ease-in-out', style({transform: 'translateY({{offsetLeave}}%)'}))
      ], {optional: true}),
    ])
  ]),
]);
