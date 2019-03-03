import {Directive, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[audio]'
})
export class AudioDirective {
  audio: HTMLAudioElement;
  @Input('audio') url: string;

  @HostListener('click') onClick() {
    if (this.audio && !this.audio.ended) return;
    this.audio = new Audio(this.url);
    return this.audio.play();
  }

  constructor() {
  }

}
