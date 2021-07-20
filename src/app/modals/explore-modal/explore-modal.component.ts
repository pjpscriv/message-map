import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PreProcessingService } from 'src/app/shared/pre-processing.service';
import { ProcessingModalComponent } from '../processing-modal/processing-modal.component';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/app.state';
import {UpdateLoadProgressAction} from '../../store/app.actions';

@Component({
  selector: 'app-explore-modal',
  templateUrl: './explore-modal.component.html',
  styleUrls: ['./explore-modal.component.css']
})
export class ExploreModalComponent {

  constructor(
    private store: Store<AppState>,
    private preProcessingService: PreProcessingService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ExploreModalComponent>
  ) {}

  public readFiles(event: any): void {
    this.store.dispatch(UpdateLoadProgressAction({ loadProgress: 0 }));
    this.dialogRef.close();
    this.dialog.open(ProcessingModalComponent);
    this.preProcessingService.readFiles(event.target.files);
  }
}
