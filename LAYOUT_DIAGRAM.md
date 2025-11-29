# Diagrama de Distribución Visual - Pantalla de Pádel

## Estructura General

```
┌─────────────────────────────────────────────────────────────┐
│                    PANTALLA COMPLETA                        │
│                                                             │
│  ┌──────────────────────┬──────────────────────┐           │
│  │   MITAD IZQUIERDA    │   MITAD DERECHA      │           │
│  │   (AZUL - EQUIPO 1)  │   (ROJO - EQUIPO 2) │           │
│  │                      │                      │           │
│  │                      │                      │           │
│  │   ┌──────────────┐   │   ┌──────────────┐  │           │
│  │   │              │   │   │              │  │           │
│  │   │   PUNTOS     │   │   │   PUNTOS     │  │           │
│  │   │   DEL JUEGO  │   │   │   DEL JUEGO  │  │           │
│  │   │   ACTUAL     │   │   │   ACTUAL     │  │           │
│  │   │              │   │   │              │  │           │
│  │   │     15       │   │   │     30       │  │           │
│  │   │   (72px)     │   │   │   (72px)     │  │           │
│  │   └──────────────┘   │   └──────────────┘  │           │
│  │                      │                      │           │
│  │   ┌──────────────┐   │   ┌──────────────┐  │           │
│  │   │ JUEGOS SET   │   │   │ JUEGOS SET   │  │           │
│  │   │   ACTUAL     │   │   │   ACTUAL     │  │           │
│  │   │              │   │   │              │  │           │
│  │   │      3       │   │   │      2       │  │           │
│  │   │   (24px)     │   │   │   (24px)     │  │           │
│  │   └──────────────┘   │   └──────────────┘  │           │
│  │                      │                      │           │
│  │   ┌──────────────┐   │   ┌──────────────┐  │           │
│  │   │ HISTORIAL    │   │   │ HISTORIAL    │  │           │
│  │   │   DE SETS    │   │   │   DE SETS    │  │           │
│  │   │              │   │   │              │  │           │
│  │   │ Set 1: 6-4   │   │   │ Set 1: 4-6   │  │           │
│  │   │ Set 2: 4-6   │   │   │ Set 2: 6-4   │  │           │
│  │   │              │   │   │              │  │           │
│  │   │   (14px)     │   │   │   (14px)     │  │           │
│  │   └──────────────┘   │   └──────────────┘  │           │
│  │                      │                      │           │
│  │   ┌──────────────┐   │   ┌──────────────┐  │           │
│  │   │  SETS GANADOS│   │   │  SETS GANADOS│  │           │
│  │   │              │   │   │              │  │           │
│  │   │      1       │   │   │      1       │  │           │
│  │   │   (20px)     │   │   │   (20px)     │  │           │
│  │   └──────────────┘   │   └──────────────┘  │           │
│  │                      │                      │           │
│  └──────────────────────┴──────────────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Distribución Vertical (de arriba hacia abajo)

### MITAD IZQUIERDA (Equipo 1 - Azul)
```
┌─────────────────────────────┐
│                             │
│   [PUNTOS DEL JUEGO]        │  ← Grande, centrado (72px)
│         15 / 30 / 40 / V    │     Muestra: 0, 15, 30, 40, V
│                             │     Si tie-break: número (0-7+)
│   ─────────────────────     │
│                             │
│   [JUEGOS DEL SET ACTUAL]   │  ← Mediano (24px)
│            3                │     Muestra juegos ganados en set actual
│                             │
│   ─────────────────────     │
│                             │
│   [HISTORIAL DE SETS]       │  ← Pequeño (14px)
│   Set 1: 6-4                │     Solo sets completados
│   Set 2: 4-6                │     Formato: "Set N: X-Y"
│                             │
│   ─────────────────────     │
│                             │
│   [SETS GANADOS TOTALES]    │  ← Mediano (20px)
│            1                │     Contador de sets ganados (0-2)
│                             │
└─────────────────────────────┘
```

### MITAD DERECHA (Equipo 2 - Rojo)
```
┌─────────────────────────────┐
│                             │
│   [PUNTOS DEL JUEGO]        │  ← Grande, centrado (72px)
│         30 / 40 / V         │     Mismo formato que izquierda
│                             │
│   ─────────────────────     │
│                             │
│   [JUEGOS DEL SET ACTUAL]   │  ← Mediano (24px)
│            2                │     Mismo formato que izquierda
│                             │
│   ─────────────────────     │
│                             │
│   [HISTORIAL DE SETS]       │  ← Pequeño (14px)
│   Set 1: 4-6                │     Mismo formato que izquierda
│   Set 2: 6-4                │
│                             │
│   ─────────────────────     │
│                             │
│   [SETS GANADOS TOTALES]    │  ← Mediano (20px)
│            1                │     Mismo formato que izquierda
│                             │
└─────────────────────────────┘
```

## Ejemplo de Estados Visuales

### Estado 1: Juego Normal (No Tie-Break)
```
┌──────────────────────┬──────────────────────┐
│   EQUIPO 1 (AZUL)    │   EQUIPO 2 (ROJO)   │
│                      │                      │
│        30            │        40            │  ← Puntos del juego
│                      │                      │
│         2            │         3            │  ← Juegos del set
│                      │                      │
│   Set 1: 6-4         │   Set 1: 4-6         │  ← Historial
│                      │                      │
│         1            │         0            │  ← Sets ganados
└──────────────────────┴──────────────────────┘
```

### Estado 2: Tie-Break
```
┌──────────────────────┬──────────────────────┐
│   EQUIPO 1 (AZUL)    │   EQUIPO 2 (ROJO)   │
│                      │                      │
│         5            │         4            │  ← Puntos tie-break
│                      │                      │
│         6            │         6            │  ← Juegos del set (6-6)
│                      │                      │
│   Set 1: 6-4         │   Set 1: 4-6         │  ← Historial
│                      │                      │
│         1            │         0            │  ← Sets ganados
└──────────────────────┴──────────────────────┘
```

### Estado 3: Deuce (40-40)
```
┌──────────────────────┬──────────────────────┐
│   EQUIPO 1 (AZUL)    │   EQUIPO 2 (ROJO)   │
│                      │                      │
│        40            │        40            │  ← Ambos en 40
│                      │                      │
│         3            │         4            │  ← Juegos del set
│                      │                      │
│   Set 1: 6-4         │   Set 1: 4-6         │  ← Historial
│                      │                      │
│         1            │         0            │  ← Sets ganados
└──────────────────────┴──────────────────────┘
```

### Estado 4: Ventaja
```
┌──────────────────────┬──────────────────────┐
│   EQUIPO 1 (AZUL)    │   EQUIPO 2 (ROJO)   │
│                      │                      │
│         V            │        40            │  ← Equipo 1 con ventaja
│                      │                      │
│         4            │         3            │  ← Juegos del set
│                      │                      │
│   Set 1: 6-4         │   Set 1: 4-6         │  ← Historial
│                      │                      │
│         1            │         0            │  ← Sets ganados
└──────────────────────┴──────────────────────┘
```

## Espaciado y Tamaños Sugeridos

- **Puntos del juego**: 72px, bold, monospace, centrado verticalmente
- **Juegos del set**: 24px, semibold, 20px de margen superior
- **Historial de sets**: 14px, regular, 16px de margen superior, lista vertical
- **Sets ganados**: 20px, semibold, 16px de margen superior
- **Espaciado entre secciones**: 20-24px
- **Padding lateral**: 16px mínimo

## Comportamiento Visual

1. **Al tocar una mitad**: Agrega punto al equipo correspondiente
2. **Long press**: Deshace último punto (vibración)
3. **Swipe izquierda**: Cancela partido y vuelve a Home
4. **Pantalla de victoria**: Misma estructura pero solo muestra ganador y resultado final

