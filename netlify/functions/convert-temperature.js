'use strict';

const TEMPERATURE_UNITS = ['celsius', 'kelvin', 'fahrenheit'];

function round(num, decimals = 6) {
  const factor = 10 ** decimals;
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

// Devuelve el resultado y la fórmula matemática usada para cada combinación posible
function convertTemperature(value, from, to) {
  if (from === to) {
    return { result: round(value), formula: 'value (misma unidad, sin conversión)' };
  }

  const conversions = {
    'celsius->fahrenheit': { result: (value * 9) / 5 + 32, formula: '(value * 9/5) + 32' },
    'fahrenheit->celsius': { result: ((value - 32) * 5) / 9, formula: '(value - 32) * 5/9' },
    'celsius->kelvin': { result: value + 273.15, formula: 'value + 273.15' },
    'kelvin->celsius': { result: value - 273.15, formula: 'value - 273.15' },
    'fahrenheit->kelvin': {
      result: ((value - 32) * 5) / 9 + 273.15,
      formula: '((value - 32) * 5/9) + 273.15',
    },
    'kelvin->fahrenheit': {
      result: ((value - 273.15) * 9) / 5 + 32,
      formula: '((value - 273.15) * 9/5) + 32',
    },
  };

  const { result, formula } = conversions[`${from}->${to}`];
  return { result: round(result), formula };
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

  if (!TEMPERATURE_UNITS.includes(fromUnit)) {
    return errorResponse(
      400,
      'Unidad no válida',
      `La unidad '${from}' no está soportada para conversión de temperatura`
    );
  }
  if (!TEMPERATURE_UNITS.includes(toUnit)) {
    return errorResponse(
      400,
      'Unidad no válida',
      `La unidad '${to}' no está soportada para conversión de temperatura`
    );
  }

  const { result, formula } = convertTemperature(numericValue, fromUnit, toUnit);

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
