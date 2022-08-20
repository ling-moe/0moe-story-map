import { ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'inline-edit',
  templateUrl: './inline-edit.component.html',
  styleUrls: ['./inline-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineEditComponent implements OnInit {

  @Input()
  content!: string;

  editFlag = false;

  @Output()
  contentChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }
  toggle() {
    this.editFlag = !this.editFlag;
    if (!this.editFlag){
      this.contentChange.emit(this.content);
    }
  }
}
