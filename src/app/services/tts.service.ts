import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TtsService {
  constructor() {
  }

  static set tts(voice) {
    localStorage.setItem('voice', voice);
  }

  static get tts(): any {
    return localStorage.getItem('voice');
  }

  speak(word: string) {
    let voice = TtsService.tts;
    if (!voice) voice = speechSynthesis.getVoices()[0];

    const utterThis = new SpeechSynthesisUtterance(word);
    utterThis.voice = speechSynthesis.getVoices()[voice];
    speechSynthesis.speak(utterThis);
  }
}
