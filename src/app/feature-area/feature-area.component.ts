import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Issue } from '../story-map.type';

@Component({
  selector: 'feature-area',
  templateUrl: './feature-area.component.html',
  styleUrls: ['./feature-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureAreaComponent implements OnInit {

  @Input()
  featureList!: Issue[];

  @Output()
  issueCreate = new EventEmitter<Issue>();

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
  }

  emit(type: 'STORY' | 'FEATURE' | 'TASK', content: string){
    this.issueCreate.emit({type, content})
  }

}
