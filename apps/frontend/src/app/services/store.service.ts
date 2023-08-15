import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, of, switchMap } from 'rxjs';

import type { ICreateStore, IStore, IUpdateStore } from '@api/types';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private readonly apiURL = process.env['NX_API_URL'];

  constructor(private http: HttpClient) {}

  getStoreData() {
    return this.getStore().pipe(
      switchMap((store) => {
        return forkJoin({
          store: of(store)
        });
      })
    );
  }

  getStore() {
    return this.http.get<IStore>(`${this.apiURL}/store`);
  }

  createStore(store: ICreateStore) {
    return this.http.post<IStore>(`${this.apiURL}/store`, store);
  }

  updateStore(store: IUpdateStore) {
    return this.http.put<IStore>(`${this.apiURL}/store`, store);
  }
}
