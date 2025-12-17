import {AbstractControl, ValidationErrors} from '@angular/forms';

export class ValidacionesPropias {

  static validarDNI(control: AbstractControl): ValidationErrors | null {
    var regex = /^[0-9]{8}[A-Z]$/;
    var letrasArray = "TRWAGMYFPDXBNJZSQVHLCKE";
    const dni = control.value

    if (dni == ""){
      return null;
    }

    if (!regex.test(dni)) {
      return {validarDNI: true };
    }

    var numeroDni = parseInt(dni.substring(0, 8), 10);
    var letraDni = letrasArray[numeroDni % 23];

    if (letraDni != dni.substring(8)){
      return {validarDNI: true}
    }
    return null
  }

  static validarFecha(control: AbstractControl): ValidationErrors | null {
    const fecha = control.value;
    // Formato correcto dd/mm/yyyy
    var regex = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
    if (!regex.test(fecha)) {
      return {validarFecha: true }
    }

    // Extraer partes de la fecha
    var dia = parseInt(fecha.substring(0, 2), 10);
    var mes = parseInt(fecha.substring(3, 5), 10);
    var year = parseInt(fecha.substring(6, 10), 10);

    // Validar mes
    if (mes < 1 || mes > 12) {
      return {validarFecha: true }
    }

    // Calcular si es bisiesto
    var esBisiesto = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

    // Validar días según el mes
    if (mes === 2) { // Febrero
      if (esBisiesto) {
        if (dia < 1 || dia > 29) return {validarFecha: true };
      } else {
        if (dia < 1 || dia > 28) return {validarFecha: true };
      }
    } else if ([4, 6, 9, 11].includes(mes)) {
      if (dia < 1 || dia > 30) return {validarFecha: true };
    } else {
      if (dia < 1 || dia > 31) return {validarFecha: true };
    }

    // Validar que no sea superior a la fecha actual
    var miFecha = new Date(year, mes - 1, dia);
    var fechaActual = new Date();

    if (miFecha > fechaActual) {
      return {validarFecha: true };
    }

    return null;
  }

  static validarExtension(control: AbstractControl): ValidationErrors | null  {
// Si no hay valor, no validamos (esto lo hace el Validators.required si fuera necesario)
    if (!control.value) {
      return null;
    }
    const nombreArchivo = control.value.toLowerCase();

    if (!nombreArchivo.endsWith(".png") && !nombreArchivo.endsWith(".jpg") && !nombreArchivo.endsWith(".gif")){
      return {validarExtension: true}
    }
    return null
  }

  static validarCP(control: AbstractControl): ValidationErrors | null  {
    const cp = control.value;
    if(!isNaN(cp) && cp.length == 5 && parseInt(cp.substr(0, 2)) > 0 && parseInt(cp.substr(0, 2)) < 53){
      return null
    }
    return {validarExtension: true};
  }

  // Validador para Select Múltiple (Intereses) y Select Simple (Situación)
  static validarListas(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;
    // En select múltiple, Angular devuelve un array. En simple, un string.
    if (!valor || (Array.isArray(valor) && valor.length === 0)) {
      return { seleccionObligatoria: true };
    }
    return null;
  }

  // Función auxiliar para obtener la provincia
  static obtenerProvincia(cp: string): string {
    const provincias: { [key: string]: string } = {
      "01": "Álava", "02": "Albacete", "03": "Alicante", "04": "Almería", "05": "Ávila",
      "06": "Badajoz", "07": "Islas Baleares", "08": "Barcelona", "09": "Burgos", "10": "Cáceres",
      "11": "Cádiz", "12": "Castellón", "13": "Ciudad Real", "14": "Córdoba", "15": "A Coruña",
      "16": "Cuenca", "17": "Girona", "18": "Granada", "19": "Guadalajara", "20": "Guipúzcoa",
      "21": "Huelva", "22": "Huesca", "23": "Jaén", "24": "León", "25": "Lleida", "26": "La Rioja",
      "27": "Lugo", "28": "Madrid", "29": "Málaga", "30": "Murcia", "31": "Navarra", "32": "Ourense",
      "33": "Asturias", "34": "Palencia", "35": "Las Palmas", "36": "Pontevedra", "37": "Salamanca",
      "38": "Santa Cruz de Tenerife", "39": "Cantabria", "40": "Segovia", "41": "Sevilla",
      "42": "Soria", "43": "Tarragona", "44": "Teruel", "45": "Toledo", "46": "Valencia",
      "47": "Valladolid", "48": "Bizkaia", "49": "Zamora", "50": "Zaragoza", "51": "Ceuta", "52": "Melilla"
    };
    const prefijo = cp.substring(0, 2);
    return provincias[prefijo] || "Código desconocido";
  }

}
