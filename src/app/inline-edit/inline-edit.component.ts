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
  testEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }
  toggle() {
    this.editFlag = !this.editFlag;
    this.testEvent.emit(this.content);
  }

  log(e: any){
    return JSON.stringify(e);
  }
}
