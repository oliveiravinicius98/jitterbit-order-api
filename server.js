const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jitterbit-orders";

// =========================
// MongoDB Connection
// =========================
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

// =========================
// Schemas
// =========================
const itemSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true
    },
    value: {
      type: Number,
      required: true
    },
    creationDate: {
      type: Date,
      required: true
    },
    items: {
      type: [itemSchema],
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const Order = mongoose.model("Order", orderSchema);

// =========================
// Helper: mapping input JSON
// =========================
function mapIncomingOrder(payload) {
  return {
    orderId: payload.numeroPedido,
    value: payload.valorTotal,
    creationDate: payload.dataCriacao,
    items: Array.isArray(payload.items)
      ? payload.items.map((item) => ({
          productId: Number(item.idItem),
          quantity: item.quantidadeItem,
          price: item.valorItem
        }))
      : []
  };
}

// =========================
// Health Check
// =========================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Jitterbit Order API is running"
  });
});

// =========================
// Create Order
// POST /order
// =========================
app.post("/order", async (req, res) => {
  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    if (!numeroPedido || !valorTotal || !dataCriacao || !items) {
      return res.status(400).json({
        error: "Missing required fields: numeroPedido, valorTotal, dataCriacao, items"
      });
    }

    const mappedOrder = mapIncomingOrder(req.body);

    const existingOrder = await Order.findOne({ orderId: mappedOrder.orderId });
    if (existingOrder) {
      return res.status(409).json({
        error: "Order already exists"
      });
    }

    const newOrder = await Order.create(mappedOrder);

    return res.status(201).json({
      message: "Order created successfully",
      data: newOrder
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
});

// =========================
// Get Order by ID
// GET /order/:id
// =========================
app.get("/order/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ orderId: id });

    if (!order) {
      return res.status(404).json({
        error: "Order not found"
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
});

// =========================
// List All Orders
// GET /order/list
// =========================
app.get("/order/list", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.status(200).json({
      total: orders.length,
      data: orders
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
});

// =========================
// Update Order by ID
// PUT /order/:id
// =========================
app.put("/order/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const mappedOrder = mapIncomingOrder(req.body);

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: id },
      mappedOrder,
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        error: "Order not found"
      });
    }

    return res.status(200).json({
      message: "Order updated successfully",
      data: updatedOrder
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
});

// =========================
// Delete Order by ID
// DELETE /order/:id
// =========================
app.delete("/order/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findOneAndDelete({ orderId: id });

    if (!deletedOrder) {
      return res.status(404).json({
        error: "Order not found"
      });
    }

    return res.status(200).json({
      message: "Order deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
