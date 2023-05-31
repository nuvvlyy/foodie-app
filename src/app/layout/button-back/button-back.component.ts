import { Component, Input, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'button-back',
  templateUrl: './button-back.component.html',
  styleUrls: ['./button-back.component.scss']
})
export class ButtonBackComponent implements OnInit {

  @Input() backToLanding = true;

  faChevronLeft: IconProp = faChevronLeft;
  constructor() { }

  ngOnInit(): void {
  }

}
