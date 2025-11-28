# Padel Score Tracker - Galaxy Watch 5

Aplicación para llevar el conteo de puntos de un partido de padel en Galaxy Watch 5.

## Características

- Selección de cantidad de sets (1, 3 o 5)
- Sistema de puntuación completo de padel:
  - Secuencia: 0 → 15 → 30 → 45
  - Manejo de empate en 45 (deuce)
  - Sistema de ventaja (V)
  - Reset automático cuando hay ventaja vs 45
  - Ganar juego con 2 puntos consecutivos después de 45
- Interfaz optimizada para pantalla de reloj
- Contador de sets ganados por jugador

## Instalación

### Requisitos Previos

Para ejecutar la aplicación en Android, necesitas:

1. **Android Studio** (recomendado) o **Android SDK Command Line Tools**
   - Descarga Android Studio desde: https://developer.android.com/studio
   - O instala solo las herramientas de línea de comandos

2. **Configurar variables de entorno** (agrega a tu `~/.zshrc` o `~/.bash_profile`):
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

3. **Crear archivo `android/local.properties`**:
```bash
# Reemplaza YOUR_USERNAME con tu nombre de usuario
echo "sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk" > android/local.properties
```

4. **Crear un emulador de Galaxy Watch 5** (para simular el reloj):
   
   **Opción A: Usando perfil genérico de Wear OS (Rápido)**
   - Abre Android Studio
   - Ve a **Tools > Device Manager**
   - Haz clic en **Create Device**
   - Selecciona la categoría **Wear OS**
   - Elige **"Wear OS Small Round"** (384x384, 320 dpi) - similar a Galaxy Watch 5
   - Haz clic en **Next**
   - Selecciona una imagen del sistema Wear OS 5.0 (API 34) o superior
     - Si no tienes ninguna, haz clic en **Download** junto a "Wear OS 5.0" o "API 34" para instalarla
   - Completa la configuración y crea el AVD
   
   **Opción B: Usando Galaxy Emulator Skin de Samsung (Más preciso)**
   - Descarga el Galaxy Emulator Skin desde: https://developer.samsung.com/galaxy-emulator-skin/
   - Extrae los archivos del skin
   - En Android Studio, ve a **Tools > Device Manager** > **Create Device**
   - Selecciona **Wear OS** > **New Hardware Profile**
   - Configura las especificaciones del hardware
   - En **Default Skin**, haz clic en el ícono de carpeta y selecciona el directorio donde extrajiste el Galaxy Emulator Skin
   - Completa la configuración y crea el AVD
   
   **Opción B: Usando línea de comandos**
   ```bash
   # Primero, instala la imagen del sistema Wear OS 5.0 (API 34)
   sdkmanager "system-images;android-34;wearos;x86_64"
   
   # Crea el AVD para Galaxy Watch 5
   avdmanager create avd -n galaxy_watch_5 -k "system-images;android-34;wearos;x86_64" -d "wear_small_round"
   ```
   
   **Nota importante**: El proyecto está configurado para Wear OS. Asegúrate de usar un emulador de Wear OS, no un emulador de teléfono Android regular.

### Instalación del Proyecto

1. Instalar dependencias:
```bash
npm install
```

2. Para Android/Wear OS:
```bash
npm run android
```

**Nota**: 
- Asegúrate de tener un **emulador de Wear OS** ejecutándose (no un emulador de teléfono)
- O un dispositivo Wear OS conectado con USB debugging habilitado
- Si tienes múltiples emuladores/dispositivos, puedes especificar cuál usar:
  ```bash
  npm run android -- --deviceId=galaxy_watch_5
  ```
  Para ver los dispositivos disponibles: `adb devices`

## Uso

1. Al abrir la aplicación, selecciona la cantidad de sets (1, 3 o 5)
2. Presiona "Confirmar" para comenzar el partido
3. Toca el lado izquierdo de la pantalla para sumar un punto al Jugador 1
4. Toca el lado derecho de la pantalla para sumar un punto al Jugador 2
5. El sistema maneja automáticamente:
   - La progresión de puntos (0, 15, 30, 45)
   - El estado de deuce (45-45)
   - La ventaja (V)
   - El reset cuando hay ventaja vs 45
   - El incremento de sets cuando un jugador gana un juego

## Sistema de Puntuación

- **0 → 15 → 30 → 45**: Progresión normal de puntos
- **45-45**: Estado de "deuce" - el próximo punto da ventaja
- **Ventaja (V)**: Un jugador tiene ventaja después de deuce
- **Ventaja vs 45**: Si el jugador con 45 anota, ambos vuelven a 45-45
- **Ganar juego**: Un jugador necesita 2 puntos consecutivos después de 45 para ganar el juego

## Consideraciones Técnicas

**Nota importante**: React Native no tiene soporte oficial para Wear OS. Esta aplicación está diseñada como base para:
- Migración a Kotlin con Jetpack Compose para Wear OS (recomendado)
- Uso en dispositivos Android con pantallas pequeñas
- Desarrollo y testing en emuladores

## Estructura del Proyecto

```
padel/
├── App.tsx                    # Componente principal con navegación
├── src/
│   ├── screens/
│   │   ├── SetSelectionScreen.tsx  # Pantalla de selección de sets
│   │   └── GameScreen.tsx          # Pantalla principal del juego
│   ├── components/
│   │   └── ScoreDisplay.tsx        # Componente para mostrar puntuación
│   ├── hooks/
│   │   └── usePadelScore.ts        # Hook para manejar lógica de puntuación
│   └── types/
│       └── score.ts               # Tipos TypeScript
└── package.json
```

## Desarrollo

Para ejecutar en modo desarrollo:

```bash
npm start
```

En otra terminal:

```bash
npm run android
```

## Licencia

MIT

