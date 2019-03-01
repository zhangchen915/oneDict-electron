import {trigger, transition, group, query, style, animate} from '@angular/animations';

export const RouterAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', style({position: 'fixed', width: '100%'})
      , {optional: true}),
    group([  // block executes in parallel
      query(':enter', [
        style({transform: 'translateY(100%)'}),
        animate('.25s ease-in-out', style({transform: 'translateY(0%)'}))
      ], {optional: true}),
      query(':leave', [
        style({transform: 'translateY(0%)'}),
        animate('.25s ease-in-out', style({transform: 'translateY(-100%)'}))
      ], {optional: true}),
    ])
  ])
]);
