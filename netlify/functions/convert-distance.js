'use strict';

// Factores de conversión hacia la unidad base (metros)
const DISTANCE_UNITS = {
  metros: 1,
  kilometros: 1000,
  centimetros: 0.01,
  millas: 1609.344,
  yardas: 0.9144,
  pies: 0.3048,
  pulgadas: 0.0254,
};

function round(num, decimals = 6) {
  const factor = 10 ** decimals;
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(body, null, 2),
  };
}

function errorResponse(statusCode, error, message) {
  return jsonResponse(statusCode, { success: false, error, message });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return errorResponse(
      405,
      'Método no permitido',
      `El método '${event.httpMethod}' no está permitido. Utiliza GET.`
    );
  }

  const { value, from, to } = event.queryStringParameters || {};

  if (value === undefined || value === null || String(value).trim() === '') {
    return errorResponse(400, 'Parámetro faltante', "El parámetro 'value' es requerido");
  }
  if (!from) {
    return errorResponse(400, 'Parámetro faltante', "El parámetro 'from' es requerido");
  }
  if (!to) {
    return errorResponse(400, 'Parámetro faltante', "El parámetro 'to' es requerido");
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return errorResponse(400, 'Valor inválido', `El valor '${value}' no es un número válido`);
  }

  const fromUnit = String(from).toLowerCase().trim();
  const toUnit = String(to).toLowerCase().trim();

  if (!(fromUnit in DISTANCE_UNITS)) {
    return errorResponse(
      400,
      'Unidad no válida',
      `La unidad '${from}' no está soportada para conversión de distancia`
    );
  }
  if (!(toUnit in DISTANCE_UNITS)) {
    return errorResponse(
      400,
      'Unidad no válida',
      `La unidad '${to}' no está soportada para conversión de distancia`
    );
  }

  // Se convierte primero a la unidad base (metros) y luego a la unidad destino
  const factor = DISTANCE_UNITS[fromUnit] / DISTANCE_UNITS[toUnit];
  const result = round(numericValue * factor);
  const formula =
    fromUnit === toUnit ? 'value (misma unidad, sin conversión)' : `value * ${round(factor)}`;

  return jsonResponse(200, {
    success: true,
    data: {
      value: numericValue,
      from: fromUnit,
      to: toUnit,
      result,
      formula,
    },
  });
};
