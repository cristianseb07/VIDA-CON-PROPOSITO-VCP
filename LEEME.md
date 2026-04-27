# 📖 Guía de Mantenimiento - Web Iglesia Vida con Propósito

Esta web ha sido diseñada para que puedas actualizar todo su contenido sin tocar el código fuente. Solo necesitas editar los archivos JSON dentro de la carpeta del proyecto.

## 🛠️ Cómo Editar el Contenido

### ⚠️ IMPORTANTE
Ahora los archivos terminan en **`.js`**. Solo debes editar lo que está entre las llaves `{ }` o corchetes `[ ]`. **NO borres** el texto que dice `const CONFIG_DATA =` ni el punto y coma `;` final.

### 1. Configuración General (`config.js`)
Aquí puedes cambiar la identidad de la iglesia.
- **nombre_iglesia**: El nombre que aparece en toda la web.
- **mensaje_bienvenida**: La frase principal del inicio.
- **direccion / email / telefonos**: Datos de contacto.
- **whatsapp_numero**: Código de país + número (ej: `541112345678`).
- **youtube_embed_id**: El código que aparece al final de la URL de un video de YouTube (ej: `dQw4w9WgXcQ`).

### 2. Noticias y Novedades (`noticias.js`)
- **titulo**: Nombre de la noticia.
- **descripcion**: Texto breve.
- **imagen**: Usa una URL de internet o una ruta local.

### 3. Calendario de Eventos (`eventos.js`)
- **titulo**: Nombre del evento.
- **fecha**: Formato AAAA-MM-DD (ej: `2026-12-25`).
- **hora**: Ej: `19:00 PM`.
- **ubicacion**: Dónde será el evento.

---

## 🚀 Cómo visualizar los cambios
Simplemente refresca la página en tu navegador (`F5`). Si los cambios no aparecen, asegúrate de que el formato JSON sea correcto (que no falten comas ni comillas).

## 💡 Recomendaciones para Imágenes
- Procura que las imágenes de noticias sean de formato horizontal (16:9).
- Si usas imágenes locales, guárdalas en la carpeta `assets/` para que la web pueda encontrarlas.

---
**¡Bendiciones en este proyecto!**
