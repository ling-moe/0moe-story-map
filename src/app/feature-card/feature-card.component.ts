import { Issue } from './../story-map.type';
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
  type!: 'STORY' | 'FEATURE' | 'TASK';
  @Input()
  person!: string;

  editFlag = false;

  @Output()
  issueModify = new EventEmitter<Issue>();

  constructor() { }

  ngOnInit(): void {
  }

  toggle() {
    this.editFlag = !this.editFlag;
    this.issueModify.emit({content: this.content, type: this.type, person: this.person});
  }
}
