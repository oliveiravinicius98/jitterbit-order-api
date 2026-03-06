# Jitterbit Order API

Simple Node.js API developed for the Jitterbit technical test.

## Overview

This project is a REST API for order management, supporting CRUD operations and JSON field mapping before saving data into the database.

## Technologies

- Node.js
- Express
- MongoDB
- Mongoose

## Endpoints

### Create order
POST `/order`

### Get order by ID
GET `/order/:id`

Example:
GET `/order/v10089016vdb`

### List all orders
GET `/order/list`

### Update order
PUT `/order/:id`

### Delete order
DELETE `/order/:id`

## Input JSON

```json
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
