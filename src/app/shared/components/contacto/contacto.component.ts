// contact.component.ts
import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirestoreService } from '../../../core/services/firestore-service';
 
// Asegúrate de que esta ruta sea correcta para tu proyecto 

// Interfaz para la estructura del mensaje de contacto
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: Date;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contacto.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./contacto.component.scss'] 
})
export class ContactComponent implements OnInit {

  public contactForm!: FormGroup;
  public isSubmitting = false;
  public isSubmitted = false;

  // Inyectamos el servicio de Firestore utilizando la función `inject`
  private firestore = inject(FirestoreService);
  private fb = inject(FormBuilder); 

  ngOnInit(): void {
    // Inicializamos el formulario reactivo con los campos y validadores
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // Método para manejar el envío del formulario
  public submitForm():void{
    // Marca todos los campos como "tocados" para mostrar los mensajes de validación
    this.contactForm.markAllAsTouched();

    if (this.contactForm.valid) {
      this.isSubmitting = true;
      try {
        // Obtenemos los valores del formulario
        const { name, email, subject, message } = this.contactForm.value;

        // Solo letras y espacios
        const cleanedName = name.replace(/[^a-zA-Z\s]/g, '');

        // ID: minúsculas, sin espacios, sin caracteres especiales ni números
        const UUID = cleanedName.toLowerCase().replace(/\s+/g, '-');

        // Creamos el objeto del mensaje, incluyendo un ID único y la fecha
        const contactMessage: ContactMessage = {
          id: UUID, // Usamos un UUID para un ID único
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          timestamp: new Date()
        };

        console.log('Enviando mensaje:', contactMessage);
        
        this.saveContactMessage(contactMessage, 'contactMessages', contactMessage.id);
        // Guardamos el mensaje en Firestore en la colección 'contactMessages'
        /* await this.firestore.createDoc(contactMessage, 'contactMessages', contactMessage.id).then(() => {
          console.log('Éxito al guardar la asistencia');
        })
        .catch((error: any) => {
          console.log('Error al guardar la asistencia:', error);
        }); */

        console.log('Mensaje enviado a Firestore:', contactMessage);

        this.isSubmitted = true;
        this.contactForm.reset();

        // Reiniciamos el estado del formulario después de un breve periodo
        setTimeout(() => {
          this.isSubmitted = false;
        }, 3000);

      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.');
      } finally {
        this.isSubmitting = false;
      }
    } else {
      console.log('El formulario no es válido');
    }
  }

  private saveContactMessage(contactMessage: any, path: string, id: string) {
    this.firestore
      .createDoc(contactMessage, path, id)
      .then(() => {
        console.log('Éxito al guardar la asistencia');
      })
      .catch((error: any) => {
        console.log('Error al guardar la asistencia:', error);
      });
  }

}