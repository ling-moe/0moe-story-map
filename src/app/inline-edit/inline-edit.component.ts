import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }
  toggle() {
    this.editFlag = !this.editFlag;
  }
}
