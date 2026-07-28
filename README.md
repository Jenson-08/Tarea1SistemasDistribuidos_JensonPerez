# Unit Converter API

API REST serverless para conversión de unidades de **distancia**, **temperatura** y **peso**, construida con Node.js y desplegada como **Netlify Functions**. Es una API pura (sin frontend): cada tipo de conversión se implementa como una función serverless independiente que responde en formato JSON.

**URL pública:** https://tarea1sistemdistribuidos-jensonperez.netlify.app

## Tecnologías utilizadas

- **Node.js** (JavaScript, sin frameworks)
- **Netlify Functions** (AWS Lambda administrado por Netlify)
- **API REST** con respuestas JSON
- Sin dependencias externas en producción

## Estructura del proyecto

```
unit-converter-api/
│
├── netlify/
│   └── functions/
│       ├── convert-distance.js       # Función serverless: conversión de distancia
│       ├── convert-temperature.js    # Función serverless: conversión de temperatura
│       └── convert-weight.js         # Función serverless: conversión de peso
│
├── package.json
├── netlify.toml
├── README.md
└── .gitignore
```

## Instalación

Requisitos previos:

- [Node.js](https://nodejs.org/) 18 o superior
- Cuenta gratuita en [Netlify](https://www.netlify.com/)
- Netlify CLI instalado globalmente:

```bash
npm install -g netlify-cli
```

Clonar/entrar al proyecto e instalar dependencias (el proyecto no tiene dependencias de producción, pero `npm install` prepara el entorno):

```bash
cd unit-converter-api
npm install
```

## Ejecución local

Con Netlify CLI instalado, levanta un servidor local que simula el entorno de Netlify (funciones + redirects incluidos):

```bash
netlify dev
```

Por defecto queda disponible en `http://localhost:8888`, con las mismas rutas `/api/...` que en producción (ver sección [Endpoints disponibles](#endpoints-disponibles)).

## Endpoints disponibles

| Endpoint | Método | Descripción |
|---|---|---|
| `/api/convert-distance` | GET | Convierte valores de distancia |
| `/api/convert-temperature` | GET | Convierte valores de temperatura |
| `/api/convert-weight` | GET | Convierte valores de peso |

### Parámetros requeridos (query string)

Los tres endpoints reciben los mismos parámetros:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `value` | número | Valor numérico a convertir |
| `from` | string | Unidad de origen |
| `to` | string | Unidad de destino |

### Unidades soportadas

**Distancia** (`/api/convert-distance`): `metros`, `kilometros`, `centimetros`, `millas`, `yardas`, `pies`, `pulgadas`

**Temperatura** (`/api/convert-temperature`): `celsius`, `kelvin`, `fahrenheit`

**Peso** (`/api/convert-weight`): `kilos`, `gramos`, `toneladas`, `libras`, `onzas`

## Ejemplos de respuestas exitosas

`GET /api/convert-distance?value=5&from=kilometros&to=millas`

```json
{
  "success": true,
  "data": {
    "value": 5,
    "from": "kilometros",
    "to": "millas",
    "result": 3.106856,
    "formula": "value * 0.621371"
  }
}
```

`GET /api/convert-temperature?value=25&from=celsius&to=fahrenheit`

```json
{
  "success": true,
  "data": {
    "value": 25,
    "from": "celsius",
    "to": "fahrenheit",
    "result": 77,
    "formula": "(value * 9/5) + 32"
  }
}
```

`GET /api/convert-weight?value=50&from=kilos&to=libras`

```json
{
  "success": true,
  "data": {
    "value": 50,
    "from": "kilos",
    "to": "libras",
    "result": 110.231133,
    "formula": "value * 2.204623"
  }
}
```

## Ejemplos de errores

Parámetro faltante (`GET /api/convert-distance?from=kilometros&to=millas`) → **400**

```json
{
  "success": false,
  "error": "Parámetro faltante",
  "message": "El parámetro 'value' es requerido"
}
```

Valor no numérico (`GET /api/convert-distance?value=abc&from=kilometros&to=millas`) → **400**

```json
{
  "success": false,
  "error": "Valor inválido",
  "message": "El valor 'abc' no es un número válido"
}
```

Unidad no válida (`GET /api/convert-weight?value=1000&from=km&to=kilos`) → **400**

```json
{
  "success": false,
  "error": "Unidad no válida",
  "message": "La unidad 'km' no está soportada para conversión de peso"
}
```

Unidad de otro tipo de conversión (`GET /api/convert-temperature?value=5&from=millas&to=celsius`) → **400**

```json
{
  "success": false,
  "error": "Unidad no válida",
  "message": "La unidad 'millas' no está soportada para conversión de temperatura"
}
```

Método HTTP no permitido (`POST /api/convert-distance`) → **405**

```json
{
  "success": false,
  "error": "Método no permitido",
  "message": "El método 'POST' no está permitido. Utiliza GET."
}
```

## Pruebas sobre la API pública

Los siguientes enlaces son peticiones GET reales sobre el despliegue en producción: se pueden abrir directamente en el navegador, o importar en Postman/Insomnia como una colección GET.

### Happy path

- https://tarea1sistemdistribuidos-jensonperez.netlify.app/api/convert-distance?value=5&from=kilometros&to=millas
- https://tarea1sistemdistribuidos-jensonperez.netlify.app/api/convert-distance?value=100&from=metros&to=pies
- https://tarea1sistemdistribuidos-jensonperez.netlify.app/api/convert-temperature?value=25&from=celsius&to=fahrenheit
- https://tarea1sistemdistribuidos-jensonperez.netlify.app/api/convert-temperature?value=300&from=kelvin&to=celsius
- https://tarea1sistemdistribuidos-jensonperez.netlify.app/api/convert-weight?value=50&from=kilos&to=libras
- https://tarea1sistemdistribuidos-jensonperez.netlify.app/api/convert-weight?value=1000&from=gramos&to=kilos

### Negative path

- https://tarea1sistemdistribuidos-jensonperez.netlify.app/api/convert-weight?value=1000&from=km&to=kilos (unidad `km` no soportada → 400)

### Con curl

```bash
curl "https://tarea1sistemdistribuidos-jensonperez.netlify.app/api/convert-distance?value=5&from=kilometros&to=millas"
curl -X POST "https://tarea1sistemdistribuidos-jensonperez.netlify.app/api/convert-distance?value=5&from=kilometros&to=millas" # 405
```

## Despliegue en Netlify

1. **Crear el proyecto**: usa la estructura de este repositorio tal cual (ya incluye `netlify.toml`, `package.json` y `netlify/functions/`).

2. **Instalar dependencias necesarias**:

   ```bash
   npm install -g netlify-cli
   npm install
   ```

3. **Ejecutar y probar el proyecto localmente**:

   ```bash
   netlify dev
   ```

   ```
   http://localhost:8888/api/convert-distance?value=5&from=kilometros&to=millas
   ```

4. **Crear un repositorio en GitHub**: crea un repositorio nuevo (por ejemplo `unit-converter-api`), vacío, sin README (ya tenemos uno).

5. **Subir el proyecto a GitHub**:

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Unit Converter API"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/unit-converter-api.git
   git push -u origin main
   ```

6. **Crear o conectar el proyecto en Netlify**:
   - Ingresa a [app.netlify.com](https://app.netlify.com/).
   - Click en **"Add new site" → "Import an existing project"**.
   - Selecciona **GitHub** y autoriza el acceso.
   - Elige el repositorio `unit-converter-api`.

7. **Configurar el despliegue**:
   - Netlify detecta automáticamente `netlify.toml`, así que el directorio de funciones (`netlify/functions`) y las redirecciones ya quedan configurados.
   - Build command: (vacío, no se requiere build).
   - Publish directory: `.` (ya definido en `netlify.toml`).

8. **Publicar y obtener la URL pública**: click en **"Deploy site"**. Al finalizar, Netlify asigna una URL del tipo `https://<nombre-del-sitio>.netlify.app` (renombrable desde **Site settings → Site details → Change site name**). Este proyecto quedó publicado en:

   ```
   https://tarea1sistemdistribuidos-jensonperez.netlify.app
   ```

9. **Probar los tres endpoints desde la URL pública**: ver la sección [Pruebas sobre la API pública](#pruebas-sobre-la-api-pública).
