# Unit Converter API

API REST serverless para conversión de unidades de **distancia**, **temperatura** y **peso**, construida con Node.js y desplegada como **Netlify Functions**. Es una API pura (sin frontend): cada tipo de conversión se implementa como una función serverless independiente que responde en formato JSON.

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

Por defecto quedará disponible en `http://localhost:8888`. Las funciones se pueden probar directamente en:

- `http://localhost:8888/api/convert-distance?value=5&from=kilometros&to=millas`
- `http://localhost:8888/api/convert-temperature?value=25&from=celsius&to=fahrenheit`
- `http://localhost:8888/api/convert-weight?value=50&from=kilos&to=libras`

(También responden en la ruta directa `http://localhost:8888/.netlify/functions/convert-distance`, pero se recomienda usar `/api/...` que es la ruta pública final.)

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

## Ejemplos de uso

```
GET /api/convert-distance?value=5&from=kilometros&to=millas
GET /api/convert-distance?value=100&from=metros&to=pies
GET /api/convert-distance?value=10&from=pies&to=metros

GET /api/convert-temperature?value=25&from=celsius&to=fahrenheit
GET /api/convert-temperature?value=300&from=kelvin&to=celsius
GET /api/convert-temperature?value=32&from=fahrenheit&to=celsius

GET /api/convert-weight?value=50&from=kilos&to=libras
GET /api/convert-weight?value=1000&from=gramos&to=kilos
GET /api/convert-weight?value=2&from=toneladas&to=kilos
```

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

Unidad no válida (`GET /api/convert-distance?value=5&from=kilometro&to=millas`) → **400**

```json
{
  "success": false,
  "error": "Unidad no válida",
  "message": "La unidad 'kilometro' no está soportada para conversión de distancia"
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

## Pruebas

### Desde el navegador

Simplemente pega la URL en la barra de direcciones (funciona porque son peticiones GET):

```
https://tu-app.netlify.app/api/convert-distance?value=5&from=kilometros&to=millas
```

### Desde Postman / Insomnia / curl

1. Crea una petición **GET**.
2. Pega la URL completa con sus query params, por ejemplo:
   `https://tu-app.netlify.app/api/convert-weight?value=1000&from=gramos&to=kilos`
3. Envía la petición y revisa el código de estado (200/400/405) y el cuerpo JSON de la respuesta.

Con `curl`:

```bash
curl "https://tu-app.netlify.app/api/convert-distance?value=5&from=kilometros&to=millas"
curl "https://tu-app.netlify.app/api/convert-distance?value=100&from=metros&to=pies"
curl "https://tu-app.netlify.app/api/convert-temperature?value=25&from=celsius&to=fahrenheit"
curl "https://tu-app.netlify.app/api/convert-temperature?value=300&from=kelvin&to=celsius"
curl "https://tu-app.netlify.app/api/convert-weight?value=50&from=kilos&to=libras"
curl "https://tu-app.netlify.app/api/convert-weight?value=1000&from=gramos&to=kilos"

# Casos de error
curl "https://tu-app.netlify.app/api/convert-distance?from=kilometros&to=millas"          # falta value
curl "https://tu-app.netlify.app/api/convert-distance?value=abc&from=kilometros&to=millas" # value no numérico
curl "https://tu-app.netlify.app/api/convert-distance?value=5&from=kilometro&to=millas"    # unidad inválida
curl -X POST "https://tu-app.netlify.app/api/convert-distance?value=5&from=kilometros&to=millas" # método no permitido
```

## Despliegue en Netlify

1. **Crear el proyecto**: usa la estructura de este repositorio tal cual (ya incluye `netlify.toml`, `package.json` y `netlify/functions/`).

2. **Instalar dependencias necesarias**:

   ```bash
   npm install -g netlify-cli
   npm install
   ```

3. **Ejecutar el proyecto localmente**:

   ```bash
   netlify dev
   ```

4. **Probar las funciones localmente** abriendo en el navegador o con `curl`:

   ```
   http://localhost:8888/api/convert-distance?value=5&from=kilometros&to=millas
   ```

5. **Crear un repositorio en GitHub**: en GitHub, crea un repositorio nuevo (por ejemplo `unit-converter-api`), vacío, sin README (ya tenemos uno).

6. **Subir el proyecto a GitHub**:

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Unit Converter API"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/unit-converter-api.git
   git push -u origin main
   ```

7. **Crear o conectar el proyecto en Netlify**:
   - Ingresa a [app.netlify.com](https://app.netlify.com/).
   - Click en **"Add new site" → "Import an existing project"**.
   - Selecciona **GitHub** y autoriza el acceso.
   - Elige el repositorio `unit-converter-api`.

8. **Configurar el despliegue**:
   - Netlify detecta automáticamente `netlify.toml`, así que el directorio de funciones (`netlify/functions`) y las redirecciones ya quedan configurados.
   - Build command: (vacío, no se requiere build).
   - Publish directory: `.` (ya definido en `netlify.toml`).

9. **Publicar la API**: click en **"Deploy site"**. Netlify instalará dependencias (ninguna en este caso), empaquetará las funciones y publicará el sitio.

10. **Obtener la URL pública**: al finalizar el despliegue, Netlify asigna una URL del tipo `https://<nombre-aleatorio>.netlify.app` (puedes renombrarla desde **Site settings → Site details → Change site name**).

11. **Probar los endpoints desde la URL pública**:
    ```
https://tarea1sistemdistribuidos-jensonperez.netlify.app/api/convert-distance?value=5&from=kilometros&to=millas
https://tarea1sistemdistribuidos-jensonperez.netlify.app/api/convert-distance?value=100&from=metros&to=pies
https://tarea1sistemdistribuidos-jensonperez.netlify.app/api/convert-temperature?value=25&from=celsius&to=fahrenheit
https://tarea1sistemdistribuidos-jensonperez.netlify.app/convert-temperature?value=300&from=kelvin&to=celsius
https://tarea1sistemdistribuidos-jensonperez.netlify.app/api/convert-weight?value=50&from=kilos&to=libras
https://tarea1sistemdistribuidos-jensonperez.netlify.app/api/convert-weight?value=1000&from=gramos&to=kilos
    ```

## URL pública de la API

> https://tarea1sistemdistribuidos-jensonperez.netlify.app/api/


