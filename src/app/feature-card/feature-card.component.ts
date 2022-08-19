import { ChangeDetectionStrategy, Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'feature-card',
  templateUrl: './feature-card.component.html',
  styleUrls: ['./feature-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureCardComponent implements OnInit {

  @Input()
  content!: string;
  @Input()
  type!: string;
  @Input()
  person!: string;
  editFlag = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggle() {
    this.editFlag = !this.editFlag;
    console.log(this);
  }
}
