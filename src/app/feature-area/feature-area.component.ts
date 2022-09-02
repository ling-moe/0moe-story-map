import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Issue, MoveEvent, positionConvert } from '../story-map.type';

@Component({
  selector: 'feature-area',
  templateUrl: './feature-area.component.html',
  styleUrls: ['./feature-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureAreaComponent implements OnInit {

  @Input()
  row!: number;

  @Input()
  col!: number;

  @Input()
  featureList!: Issue[];

  @Output()
  issueCreate = new EventEmitter<Issue>();

  @Output()
  issueModify = new EventEmitter<{ issue: Issue, index: number }>();

  @Output()
  issueMove = new EventEmitter<MoveEvent>();

  constructor() { }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<Issue[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.issueMove.emit({
      source: {
        ...positionConvert(event.previousContainer.id),
        index: event.previousIndex
      },
      target: {
        ...positionConvert(event.container.id),
        index: event.currentIndex
      },
      issue: event.container.data[event.currentIndex]
    });
  }

  addIssue(type: 'STORY' | 'FEATURE' | 'TASK', content: string) {
    const person = (localStorage.getItem('person') ? localStorage.getItem('person')! : 'Tom');
    const issue = { type, content, person};
    this.featureList.push(issue);
    this.issueCreate.emit(issue)
  }

  onIssueModify(issue: Issue, index: number) {
    this.issueModify.emit({ issue, index });
  }

}
