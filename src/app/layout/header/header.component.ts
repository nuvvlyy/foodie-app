import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { LineService } from 'src/app/core/services/line.service';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input()
  tittleHearder?: string;
  isShowHeader: boolean;

  faChevronLeft: IconProp = faChevronLeft;

  constructor(private location: Location, private line: LineService) {}

  ngOnInit(): void {
    this.isShowHeader = this.line.isInClient();
  }

  back(): void {
    this.location.back();
  }
}
