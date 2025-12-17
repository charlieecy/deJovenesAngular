import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidacionesPropias } from './validaciones-propias';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  miFormulario!: FormGroup;
  // Signal para la provincia reactiva
  provinciaCalculada = signal('');

  protected readonly title = signal('dejovenes');

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.miFormulario = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      DNI: ['', [Validators.required, ValidacionesPropias.validarDNI]],
      fechaNacimiento: ['', [Validators.required, ValidacionesPropias.validarFecha]],
      sexo: ['', [Validators.required]],
      dniFile: [null, [Validators.required, ValidacionesPropias.validarExtension]],
      CP: ['', [Validators.required, ValidacionesPropias.validarCP]],
      // Nuevos campos migrados
      interes: [[], [ValidacionesPropias.validarListas]],
      situacionSelect: ['', [Validators.required]],
      checkboxAcepto: [false, [Validators.requiredTrue]] // Obligatorio que sea true
    });

    // Lógica para detectar el cambio de CP y poner la provincia
    this.miFormulario.get('CP')?.valueChanges.subscribe(valor => {
      if (valor && valor.length >= 2) {
        const prov = ValidacionesPropias.obtenerProvincia(valor);
        this.provinciaCalculada.set(prov);
      } else {
        this.provinciaCalculada.set('');
      }
    });
  }

  limpiarFormulario() {
    this.miFormulario.reset({
      nombre: '', apellidos: '', DNI: '', fechaNacimiento: '',
      sexo: '', dniFile: null, CP: '', interes: [],
      situacionSelect: '', checkboxAcepto: false
    });
    this.provinciaCalculada.set('');
  }

  enviarFormulario() {
    if (this.miFormulario.valid) {
      const datos = this.miFormulario.value;
      alert("Formulario validado correctamente. Datos recogidos:\n" +
        "Nombre: " + datos.nombre + " " + datos.apellidos + "\n" +
        "Provincia: " + this.provinciaCalculada());
    }
  }
}
