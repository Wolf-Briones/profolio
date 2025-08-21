const value = {
  "hosting": {
    // La carpeta pública que Firebase Hosting debe desplegar.
    // En este caso, es la salida de una aplicación Angular Universal (SSR).
    "public": "dist/franki-briones/browser",
    
    // Archivos y carpetas que Firebase debe ignorar al momento de desplegar.
    // Es buena práctica ignorar archivos de configuración de Firebase
    // y la carpeta de dependencias de Node.js.
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    
    // Configuración de reescrituras de URL.
    // Esto es crucial para las aplicaciones de una sola página (SPA) y SSR.
    "rewrites": [
      {
        // La fuente "**" significa que cualquier URL entrante
        // que no coincida con un archivo estático
        "source": "**",
        // debe ser reescrita a la función 'ssrapp' para renderizado del lado del servidor.
        "function": "ssrapp"
      }
    ],
    
    // Configuración de encabezados HTTP personalizados.
    // Esto se usa para optimizar el rendimiento y la seguridad.
    "headers": [
      // Encabezados para imágenes.
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|ico)",
        "headers": [
          {
            "key": "Cache-Control",
            // Permite el caché público por un año y lo marca como inmutable.
            // Es seguro debido al hashing de nombres de archivo de Angular.
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      // Encabezados específicos para el favicon.
      {
        "source": "**/favicon.ico",
        "headers": [
          {
            "key": "Cache-Control",
            // Caché público por un año.
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      // Encabezados para scripts JavaScript y hojas de estilo CSS.
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            // Caché público por un año.
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      // Encabezados para el manifiesto de la PWA.
      {
        "source": "**/manifest.webmanifest",
        "headers": [
          {
            "key": "Content-Type",
            // Asegura que el tipo MIME sea correcto.
            "value": "application/manifest+json"
          },
          {
            "key": "Cache-Control",
            // Caché más corto (1 día) ya que este archivo podría actualizarse.
            "value": "public, max-age=86400"
          }
        ]
      },
      // Encabezados para fuentes web.
      {
        "source": "**/*.@(woff|woff2|ttf|otf)",
        "headers": [
          {
            "key": "Cache-Control",
            // Caché público por un año.
            "value": "public, max-age=31536000, immutable"
          },
          {
            "key": "Access-Control-Allow-Origin",
            // Permite que las fuentes se carguen desde cualquier origen,
            // lo cual es útil si se sirven desde un CDN.
            "value": "*"
          }
        ]
      }
    ]
  }
}
