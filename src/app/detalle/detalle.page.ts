//TODO-Importamos Signal en '@angular/core'
import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonList, IonItem, IonLabel
} from '@ionic/angular/standalone';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Elemento } from '../models/elemento.model';

@Component({
  selector: 'app-detalle',
  templateUrl: 'detalle.page.html',
  styleUrls: ['detalle.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton, IonList, IonItem, IonLabel,
    // Pipes: TitleCasePipe capitaliza la primera letra de cada palabra; UpperCasePipe convierte a mayúsculas
    TitleCasePipe, UpperCasePipe
  ],
})
export class DetallePage implements OnInit {

  // TODO: Modificamos elementoDetalle: Elemento | null = null; para utilizarlo con signal
  // Signal: empieza en null y se actualiza con .set() cuando lleguen los datos de navegación.
  // En el HTML se lee como elementoDetalle()
  elementoDetalle = signal<Elemento | null>(null);

  constructor() {}

  ngOnInit(): void {
    const state = history.state;
    if (state?.elementoHome) {
      //TODO: Actualizar el signal mediante set
      // Actualizamos el signal con el elemento recibido por navegación
      this.elementoDetalle.set(state.elementoHome);
    }
  }
}
