# Jitterbit Order API

Simple Node.js API developed for the Jitterbit technical test.

## Features
- Create orders
- Get order by ID
- List orders
- Update orders
- Delete orders

## Technologies
- Node.js
- Express
- MongoDB / SQL (depending on implementation)

## Example Order JSON

{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
