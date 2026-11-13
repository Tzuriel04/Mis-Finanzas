# Mis finanzas

App personal para registrar y revisar gastos, ingresos, cuentas y tarjetas de crédito. Se instala en el iPhone desde Safari, funciona sin conexión y se sincroniza con Google Sheets.

**Base de datos:** [Mis Finanzas · Google Sheets](https://docs.google.com/spreadsheets/d/1WflTqnCqNoFm42RLOSUDnus3oGMlXfIec6xhj7rvxhY/edit)

> La hoja es privada. Este enlace solo abre para su dueña; cualquier otra persona verá "Necesitas acceso".

---

## Cómo funciona

```
iPhone (app instalada)                Google                    iPhone (Atajos)
┌───────────────────────┐   sync     ┌──────────────────┐       ┌──────────────────────┐
│ Copia de la app       │ ◄────────► │ Apps Script      │ ◄──── │ Registrar movimiento │
│ Copia de los datos    │  con       │  (doPost)        │       │ Automatización Wallet│
│ Pendientes sin red    │  internet  │ Google Sheets    │       └──────────────────────┘
└───────────────────────┘            └──────────────────┘
          ▲
          │ versión nueva de la app
  GitHub Pages (este repositorio)
```

- **Este repositorio** contiene solo el diseño y la lógica de la app. No contiene datos personales ni códigos de acceso.
- **Google Sheets** guarda los datos: movimientos, cuentas, tarjetas y categorías. Recibe también los registros de los atajos de iPhone.
- **Apps Script** (dentro de la hoja) valida y guarda los cambios, y entrega los datos a la app con un código de acceso.
- **La app** guarda una copia de los datos en el celular, hace todos los cálculos ahí y sincroniza cuando hay internet.

## Funciones

- **Páginas:** Inicio, Movimientos, Gastos, Cuentas y tarjetas, Categorías, Año, y Ajustes y sincronización.
- **Registro:** el botón + registra los seis tipos de movimiento (Ingreso, Gasto, Compra TC, Pago TC, Transferencia, Reembolso TC). Funciona sin internet.
- **Tarjetas:**
  - Cupo usado con anillo de porcentaje.
  - Extracto por ciclo de corte, con fecha límite y estado: Pagado, Pagado en parte, Por pagar, Vencido o Abierto.
  - "Por pagar", con las compras pendientes en orden.
- **Gastos:** vista según compra o según pago (los pagos de TC se reparten por categoría, primero las compras más antiguas), por categoría o por medio de pago, con comparativo frente al mes anterior.
- **Meses:**
  - Un mes pasado muestra los saldos al cierre de ese mes.
  - Un mes futuro muestra el disponible proyectado después de los pagos de tarjeta que vencen.
- **Categorías:** crear, renombrar, ícono, color, presupuesto mensual opcional, ocultar y eliminar.
- **Alertas:** aviso cuando una categoría pasa del 80% de su presupuesto, y proyección del gasto al cierre del mes.
- **Gestos:** jalar para actualizar, deslizar para cambiar de mes, y deslizar un movimiento para editarlo o borrarlo.
- **Rapidez:**
  - Los cambios se ven al instante y se confirman en segundo plano; si fallan, se deshacen solos.
  - Las acciones de borrar tienen Deshacer.
  - La app solo descarga datos cuando algo cambió.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La app completa: diseño, lógica, cálculos y sincronización |
| `sw.js` | Guarda la app en el celular para abrirla al instante y sin internet |
| `manifest.webmanifest` | Nombre, ícono y colores de la app instalada |
| `icon-180.png`, `icon-192.png`, `icon-512.png` | Íconos de la app |
| `README.md` | Este documento |

El script de Google (`Código.gs`) no está en este repositorio: vive dentro de la hoja, en **Extensiones > Apps Script**.

## Instalar en el iPhone

1. Abre la dirección de GitHub Pages de este repositorio en **Safari**.
2. En **Conectar con tu hoja**, escribe:
   - **URL del script:** la de la implementación pública de Apps Script, la que termina en `/exec`.
   - **Código de acceso:** el valor de `APP_TOKEN`, que está en las Propiedades del script.
3. Toca **Compartir > Agregar a pantalla de inicio**.

## Publicar una versión nueva

1. En este repositorio, toca **Add file > Upload files**, arrastra los archivos nuevos y haz clic en **Commit changes**.
2. Si cambiaste `sw.js`, sube también el número de `VERSION` dentro del archivo.
3. En el iPhone, abre la app con internet, ciérrala y vuelve a abrirla.

Si también cambió el script, reemplaza `Código.gs` en Apps Script y crea una nueva versión de la implementación pública en **Implementar > Gestionar implementaciones**.

## Estructura de la hoja

| Pestaña | Contenido |
|---|---|
| **Movimientos** | A Fecha · B Tipo · C Cuenta · D Cuenta destino · E Categoría · F Descripción · G Monto · H ID de la app (no editar) · I a L fórmulas de apoyo |
| **Configuración** | A–C categorías de gasto (nombre, presupuesto, estilo) · D–E categorías de ingreso · H–M cuentas (nombre, tipo, saldo o deuda inicial, estado, cupo, corte y pago) · N tipos de movimiento · Q meses |

Las columnas de estilo (C y E) y de corte y pago (M) las maneja la app; no las edites a mano.

## Seguridad

- **El repositorio es público** porque GitHub Pages gratuito lo requiere. Solo contiene el código de la app.
- **Los datos** viven en la hoja privada y en el celular.
- **Hay dos códigos de acceso,** guardados en las Propiedades del script:
  - `API_TOKEN`: lo usan los atajos y solo permite registrar movimientos.
  - `APP_TOKEN`: lo usa la app y permite leer y modificar los datos.
- **Nunca subas a este repositorio** la URL `/exec`, los códigos de acceso ni exportaciones de la hoja.
- **Si un código se expone,** cámbialo en las Propiedades del script y actualízalo en la app (**Ajustes > Cambiar URL o código**) o en los atajos.

## Solución de problemas

| Mensaje | Qué hacer |
|---|---|
| "Código de acceso incorrecto" | Revisa `APP_TOKEN` en las Propiedades del script. |
| "La respuesta no es válida" | La URL debe ser la de la implementación pública y terminar en `/exec`. |
| No aparece un cambio nuevo | Cierra la app desde el selector de apps y ábrela de nuevo con internet. |
| Un pendiente no se envía | Revísalo en **Ajustes y sincronización**: el error dice qué corregir. |
| GitHub muestra error 404 | En **Settings > Pages**, confirma que la rama sea `main` y la carpeta `/ (root)`. |
