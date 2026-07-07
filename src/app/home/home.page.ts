import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
// TODO TA06 - Importamos los componentes Ionic utilizados.
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonFooter,
  IonList, IonItem, IonLabel, IonButton, IonInput,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonNote, ToastController
} from '@ionic/angular/standalone';
// TODO TA06 – Formularios reactivos
// FormBuilder simplifica la creación de FormGroup con su método group().
// ReactiveFormsModule habilita las directivas [formGroup] y formControlName en el HTML.
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TitleCasePipe, SlicePipe } from '@angular/common';
import { Elemento } from '../models/elemento.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonFooter,
    IonList, IonItem, IonLabel, IonButton, IonInput,
    // TODO TA06 - Añadimos los componentes Ionic utilizados.
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    // IonNote: componente para mostrar mensajes de error bajo los campos del formulario
    IonNote,
    // TODO TA06 – Añadimos ReactiveFormsModule para habilitar [formGroup] y formControlName
    ReactiveFormsModule,
    // Pipes: TitleCasePipe capitaliza la primera letra de cada palabra; SlicePipe recorta cadenas
    TitleCasePipe, SlicePipe
  ],
})
export class HomePage {

  busqueda = signal<string>('');

  elementos = signal<Elemento[]>([
    { id: 1, nombre: 'Angular', descripcion: 'Framework SPA de Google', categoria: 'Frontend' },
    { id: 2, nombre: 'Ionic', descripcion: 'Framework para apps híbridas', categoria: 'Mobile' },
    { id: 3, nombre: 'TypeScript', descripcion: 'Superset tipado de JavaScript', categoria: 'Lenguaje' },
    { id: 4, nombre: 'Node.js', descripcion: 'Entorno de ejecución de JS en servidor', categoria: 'Backend' },
    { id: 5, nombre: 'Capacitor', descripcion: 'Puente nativo para apps Ionic', categoria: 'Mobile' },
  ]);

  hayElementos = computed<boolean>(() => this.elementos().length > 0);

  elementosFiltrados = computed<Elemento[]>(() => {
    const texto = this.busqueda().trim().toLowerCase();
    if (!texto) {
      return this.elementos();
    }

    return this.elementos().filter(e =>
      e.nombre.toLowerCase().includes(texto)
    );
  });

  private router = inject(Router);
  private toastController = inject(ToastController);
  // TODO TA06 – FormBuilder: forma moderna de crear FormGroups con sintaxis abreviada.
  // inject() inyecta el servicio sin necesidad de declararlo en el constructor.
  private fb = inject(FormBuilder);

  // ── FORMULARIO ESTÁTICO ──────────────────────────────────────────────────────
  // fb.group() crea el FormGroup usando arrays [valorInicial, validadores]
  // en lugar de new FormControl() por cada campo.
  formularioElemento: FormGroup = this.fb.group({
    nombre:      ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required, Validators.minLength(5)]],
    categoria:   ['']
  });

  // TODO TA06 – Getters de conveniencia: acceso directo a cada control en el template.
  // Sin getters habría que escribir formularioElemento.get('nombre') cada vez.
  // El operador ! (non-null assertion) indica a TS que el control nunca será null.
  get nombre()      { return this.formularioElemento.get('nombre')!; }
  get descripcion() { return this.formularioElemento.get('descripcion')!; }
  get categoria()   { return this.formularioElemento.get('categoria')!; }

  // ── FORMULARIO DINÁMICO ──────────────────────────────────────────────────────
  // TODO TA06 – Los campos se generan desde este array.
  // Al añadir un objeto aquí, el formulario y el HTML se actualizan solos.
  campos = [
    { name: 'nombre',      label: 'Nombre',      type: 'text', validators: [Validators.required, Validators.minLength(3)] },
    { name: 'descripcion', label: 'Descripción',  type: 'text', validators: [Validators.required, Validators.minLength(5)] },
    { name: 'categoria',   label: 'Categoría',    type: 'text', validators: [] },
  ];

  formularioDinamico: FormGroup = this.fb.group({});

  //TODO: Inicializamos el formulario dinámico
  constructor() {
    this.inicializarFormDinamico();
  }

  verDetalle(elementoHome: Elemento): void {
    this.router.navigate(['/detalle'], { state: { elementoHome } });
  }

  async mostrarToast(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Lista de tecnologías cargada correctamente',
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  // TODO TA06 – Construye el FormGroup dinámico recorriendo el array "campos".
  // Cada entrada del array genera un FormControl con sus validadores.
  inicializarFormDinamico(): void {
    const group: Record<string, unknown> = {};
    for (const campo of this.campos) {
      group[campo.name] = ['', campo.validators];
    }
    this.formularioDinamico = this.fb.group(group);
  }

  // TODO TA06 – Envío del formulario dinámico: añade el elemento al signal igual que el estático.
  async agregarElemento(): Promise<void> {
    if (this.formularioDinamico.invalid) {
      this.formularioDinamico.markAllAsTouched();
      return;
    }
    const { nombre, descripcion, categoria } = this.formularioDinamico.value;
    const nuevoElemento: Elemento = {
      id:          Date.now(),
      nombre:      nombre?.trim() ?? '',
      descripcion: descripcion?.trim() ?? '',
      categoria:   categoria?.trim() || undefined
    };
    this.elementos.update(lista => [...lista, nuevoElemento]);
    this.formularioDinamico.reset();
  }
}
