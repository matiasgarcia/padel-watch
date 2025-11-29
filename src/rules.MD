# Reconstrucción del Sistema de Puntuación de Pádel

## Objetivo

Crear un nuevo sistema de puntuación desde cero que diferencie correctamente:

- **Sets**: Mejor de 3 (gana quien gane 2 sets)
- **Juegos**: Se gana un set con 6 juegos y diferencia de 2, o 7-5, o 7-6 tras tie-break
- **Puntos**: 0 → 15 → 30 → 40 → ventaja → juego ganado (con manejo de deuce)

## Archivos a crear/modificar

### 1. Nuevo hook: `src/hooks/usePadelScoreV3.ts`

Sistema completo de puntuación con:

- **Estructura de datos**:
- `sets`: Array de objetos con juegos ganados por cada set `[{player1: 6, player2: 4}, ...]`
- `currentSet`: Índice del set actual (0, 1, 2)
- `currentGame`: Puntos del juego actual `{player1: GamePoint, player2: GamePoint}`
- `isTieBreak`: Boolean indicando si estamos en tie-break
- `tieBreakScore`: Puntos del tie-break si aplica
- `matchWinner`: 1 | 2 | null

- **Lógica de puntos**:
- Secuencia: 0 → 15 → 30 → 40 → juego ganado
- Deuce (40-40): requiere ventaja y luego punto de juego
- Ventaja se pierde si el oponente gana (vuelve a 40-40)

- **Lógica de juegos**:
- Al ganar un juego, incrementar contador de juegos del set actual
- Verificar si se gana el set (6 con diferencia de 2, o 7-5, o 7-6 tras tie-break)

- **Lógica de sets**:
- Set 1 y 2: tie-break a 6-6 (primero a 7 con diferencia de 2)
- Set 3: NO hay tie-break, se juega hasta diferencia de 2 juegos
- Gana el partido quien gane 2 sets

- **Funciones principales**:
- `addPoint(player: 1 | 2)`: Agrega punto y maneja transiciones juego/set/match
- `undo()`: Deshace último punto
- `resetMatch()`: Reinicia partido completo
- Helpers para verificar victorias de juego/set/match

### 2. Actualizar tipos: `src/types/score.ts`

Agregar nuevos tipos:

- `SetScore`: `{player1: number, player2: number}` para juegos en un set
- `MatchScoreV3`: Estructura completa con array de sets y tracking detallado

### 3. Modificar: `src/screens/GameScreenSplit.tsx`

- Cambiar import de `usePadelScoreV2` a `usePadelScoreV3`
- Actualizar visualización para mostrar:
- Puntos del juego actual (o tie-break)
- Juegos del set actual
- Historial de sets completados (ej: "Set 1: 6-4, Set 2: 4-6")
- Sets ganados totales
- Mantener funcionalidad existente (swipe para cancelar, long press para undo)

## Reglas implementadas

### Puntos en un juego:

- 0 → 15 → 30 → 40 → juego ganado
- Si 40-40 (deuce): necesita ventaja → punto de juego
- Si tiene ventaja y oponente gana punto: vuelve a 40-40
- Deuce puede repetirse indefinidamente

### Sets:

- Gana set con 6 juegos y diferencia de 2
- O con 7-5
- O con 7-6 tras ganar tie-break
- Set 1 y 2: tie-break a 6-6 (primero a 7 con diferencia de 2)
- Set 3: NO tie-break, se juega hasta diferencia de 2 juegos

### Partido:

- Mejor de 3 sets (gana quien gane 2 sets)