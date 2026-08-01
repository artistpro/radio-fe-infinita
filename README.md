# Radio Fe Infinita 📻✨

Aplicación web interactiva y reproductor audiofilo de alta fidelidad para la emisora **Radio Fe Infinita** (Alabanza y Adoración 24/7).

---

## 🌐 URLs de Producción e Infraestructura

| Recurso | Enlace / Dirección | Descripción |
| :--- | :--- | :--- |
| **Sitio Web Oficial** | [https://radio-fe-infinita.vercel.app/](https://radio-fe-infinita.vercel.app/) | Landing Page interactiva en Vercel |
| **Stream Audio HTTPS (Producción)** | `https://radiobt.duckdns.org/listen/feinfinita/radio.mp3` | Señal cifrada SSL (Let's Encrypt) para reproductores web y apps |
| **Stream IP Directa (HTTP)** | `http://195.26.251.31/listen/feinfinita/radio.mp3` | Señal directa por IP |
| **Repositorio GitHub** | [artistpro/radio-fe-infinita](https://github.com/artistpro/radio-fe-infinita) | Código fuente frontend |

---

## 📡 Detalles de la Emisora (AzuraCast VPS 1)

- **Servidor Streaming**: AzuraCast en Docker (VPS 1 - `195.26.251.31`).
- **ID Estación**: `5` (`feinfinita`).
- **Formato / Calidad**: MP3 / 192 kbps, 44.1 kHz Estéreo.
- **Certificado SSL**: Let's Encrypt válido asignado a `radiobt.duckdns.org`.

---

## 🛠️ Tecnologías y Características Frontend

- **React 18 + TypeScript + Vite**: Renderizado ultrarrápido y ligero.
- **Motor de Físicas del Vinilo**: Simulación de inercia y aceleración de motor para el tocadiscos Hi-Fi (`App.tsx`).
- **Canvas 2D Particle System**: Fondo de partículas dinámico y magnético reactivo a la música y cursor del usuario.
- **HTML5 Audio API**: Manejo de stream en tiempo real con prevención de caché (`?t=timestamp`).
- **Estilos**: Vanilla CSS moderno con efectos de Glassmorphism, neón y responsividad completa.

---

## 🚀 Desarrollo Local y Despliegue

### Requisitos Previos
- Node.js 18+
- npm

### Comandos Principales

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar servidor de desarrollo local**:
   ```bash
   npm run dev
   ```

3. **Compilar para producción**:
   ```bash
   npm run build
   ```

4. **Despliegue Automático**:
   - Cada push a la rama `main` de GitHub (`artistpro/radio-fe-infinita`) despliega automáticamente la nueva versión en Vercel.
