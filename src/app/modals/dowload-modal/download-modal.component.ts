import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PreProcessingService } from 'src/app/services/pre-processing.service';
import { ProcessingModalComponent } from '../processing-modal/processing-modal.component';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/app.state';
import {UpdateLoadProgressAction} from '../../store/app.actions';

@Component({
  selector: 'app-download-modal',
  templateUrl: './download-modal.component.html',
  styleUrls: ['download-modal.component.css']
})
export class DownloadModalComponent {

  constructor(
    private store: Store<AppState>,
    private preProcessingService: PreProcessingService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DownloadModalComponent>
  ) {}

  public readFiles(event: any): void {
    this.store.dispatch(UpdateLoadProgressAction({ loadProgress: 0 }));
    this.dialogRef.close();
    this.dialog.open(ProcessingModalComponent);
    this.preProcessingService.readFiles(event.target.files);
  }
}
