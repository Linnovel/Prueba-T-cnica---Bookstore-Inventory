# bookstore-inventory-api

API REST para gestion de inventario de librerias con validacion de precios en tiempo real.

## Stack

- Node.js
- TypeScript
- Express.js
- express-validator

## Requisitos

- Node.js 18+

## Instalacion

```bash
npm install
```

## Variables de entorno

Copia `.env.example` a `.env` y ajusta valores si hace falta.

```env
PORT=3000
LOCAL_CURRENCY=EUR
DEFAULT_EXCHANGE_RATE=0.85
MARGIN_PERCENTAGE=40
```

## Ejecutar

```bash
npm run dev
```

## Build y produccion

```bash
npm run build
npm start
```

## Endpoints

- `POST /books` Crear libro
- `GET /books` Listar libros (paginacion opcional con `page` y `limit`)
- `GET /books/:id` Obtener libro por ID
- `PUT /books/:id` Actualizar libro
- `DELETE /books/:id` Eliminar libro
- `POST /books/:id/calculate-price` Calcular precio sugerido

## Validaciones de negocio

- `cost_usd` > 0
- `stock_quantity` >= 0
- `isbn` valido (ISBN-10 o ISBN-13)
- No permite ISBN duplicado
- Si falla API de cambio, usa tasa por defecto (`DEFAULT_EXCHANGE_RATE`)

## Ejemplo de payload para crear libro

```json
{
  "title": "El Quijote",
  "author": "Miguel de Cervantes",
  "isbn": "978-84-376-0494-7",
  "cost_usd": 15.99,
  "stock_quantity": 25,
  "category": "Literatura Clasica",
  "supplier_country": "ES"
}
```
