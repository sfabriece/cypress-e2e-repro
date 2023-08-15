import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

export interface ToastModel {
  header: 'Success' | 'Warning' | 'Are you sure?';
  text: string;
}

const TOAST_CSS_CLASS = 'pm-toast';

@Injectable({
  providedIn: 'root'
})
export class ToastrService {
  constructor(private toastController: ToastController) {}

  createToast(payload: ToastModel) {
    switch (payload.header) {
      case 'Success': {
        return this.successToast(payload);
      }
      case 'Warning': {
        return this.warningToast(payload);
      }
      case 'Are you sure?': {
        return this.dangerToast(payload);
      }
    }
  }

  async successToast(payload: ToastModel) {
    const toast = await this.toastController.create({
      cssClass: TOAST_CSS_CLASS,
      header: 'Success',
      message: payload.text,
      duration: 3000,
      position: 'top',
      color: 'success'
    });
    toast.present();
  }

  async warningToast(payload: ToastModel) {
    const toast = await this.toastController.create({
      cssClass: TOAST_CSS_CLASS,
      header: 'Warning',
      message: payload.text,
      duration: 3000,
      position: 'top',
      color: 'warning'
    });
    toast.present();
  }

  async dangerToast(payload: { header: string; text: string }) {
    const toast = await this.toastController.create({
      cssClass: TOAST_CSS_CLASS,
      header: payload.header,
      message: payload.text,
      duration: 3000,
      position: 'top',
      color: 'danger'
    });
    toast.present();
  }

  async persistentWarnToast(payload: { header?: string; text?: string }) {
    const toast = await this.toastController.create({
      cssClass: TOAST_CSS_CLASS,
      header: payload.header,
      message: payload.text,
      duration: 0,
      position: 'top',
      color: 'warning',
      buttons: [
        {
          text: 'Fjern',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }
}
