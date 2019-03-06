import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[italic]'
})
export class ItalicDirective implements OnInit {
  @Input() italic: string;

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    this.el.nativeElement.innerHTML =this.italic.replace(/Italic/g, 'i');
  }
}
