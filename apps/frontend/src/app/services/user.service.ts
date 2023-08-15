import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { IUser, IUserUpdateDto } from '@api/types';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiURL = process.env['NX_API_URL'];

  constructor(private http: HttpClient) {}

  me() {
    return this.http.get<IUser>(this.apiURL + '/user/me');
  }

  updateUser(payload: IUserUpdateDto) {
    return this.http.put<IUser>(this.apiURL + '/user/me', payload);
  }
}
