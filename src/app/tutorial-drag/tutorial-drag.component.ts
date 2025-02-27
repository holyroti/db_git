import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-tutorial-drag',
  templateUrl: './tutorial-drag.component.html',
  styleUrls: ['./tutorial-drag.component.css'],
  standalone: true,
  animations: [
    trigger('autoDrag', [
      state('start', style({ transform: 'translateX(0)' })),
      state('end', style({ transform: 'translateX(300px)' })), // Adjust the offset as needed
      transition('start => end', animate('1000ms ease-out'))
    ])
  ]
})
export class TutorialDragComponent {
  dragState: 'start' | 'end' = 'start';

  simulateDrag() {
    this.dragState = 'end';
    // Optionally reset state after the animation
    setTimeout(() => {
      this.dragState = 'start';
    }, 1500);
  }
}
