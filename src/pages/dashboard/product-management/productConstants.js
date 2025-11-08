import React from 'react';
export const currencies = [
  { value: "USD", label: "USD - Dólar estadounidense" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "ARS", label: "ARS - Peso argentino" },
  { value: "BRL", label: "BRL - Real brasileño" },
  { value: "CLP", label: "CLP - Peso chileno" },
  { value: "COP", label: "COP - Peso colombiano" },
  { value: "MXN", label: "MXN - Peso mexicano" },
  { value: "PEN", label: "PEN - Sol peruano" },
  { value: "UYU", label: "UYU - Peso uruguayo" },
];

export const initialProductData = {
  name: '',
  description: '',
  price: '',
  currency: 'USD',
  category: '',
  stock_quantity: '',
  image_file: null,
  image_url: null,
};