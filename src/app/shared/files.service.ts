import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { selectFileData } from '../store/app.selectors';
import { WebkitFile } from '../types/message.interface';
import { EntityState } from '@ngrx/entity';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(
    private store: Store<AppState>
  ) {}

  public getFileMap(): Observable<EntityState<WebkitFile>> {
    return this.store.pipe(select(selectFileData));
  }
}
