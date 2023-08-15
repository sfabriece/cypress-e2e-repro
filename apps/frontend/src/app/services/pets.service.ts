import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type {
  ICreatePetDto,
  IExtendedPet,
  IFullPet,
  IUpdatePetDto
} from '@api/types';

@Injectable({
  providedIn: 'root'
})
export class PetsService {
  private readonly apiURL = process.env['NX_API_URL'];

  constructor(private http: HttpClient) {}

  getPets() {
    return this.http.get<IExtendedPet[]>(`${this.apiURL}/pets`);
  }

  createPet(pet: ICreatePetDto) {
    return this.http.post<IExtendedPet>(`${this.apiURL}/pets`, pet);
  }

  updatePet(id: string, pet: IUpdatePetDto) {
    return this.http.put<IExtendedPet>(`${this.apiURL}/pets/${id}`, pet);
  }

  submitPet(petId: string) {
    return this.http.post<IExtendedPet>(
      `${this.apiURL}/pets/${petId}/submit`,
      null
    );
  }

  deletePet(petId: string) {
    return this.http.delete<IExtendedPet>(`${this.apiURL}/pets/${petId}`);
  }

  getFullPet(petId: string) {
    return this.http.get<IFullPet>(`${this.apiURL}/pets/view/${petId}`);
  }
}
