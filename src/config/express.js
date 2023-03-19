const express = require("express");
const { logErrors, boomErrorHandler, sequelizeErrorHandler, errorHandler } = require("../middlewares/error.middleware");
const { route, router } = require("../routes");
const app = express();

//Middlewares al inicio
app.use(express.json());

//Routes
app.get("/", (req, res) => {
    const healthCheck = {
        uptime: process.uptime(),
        message: "OK",
        timestamp: Date.now(),
        currentDate: new Date().toISOString(),
        service: "Crunchy 🍔",
        version: "1.0.0",
    };
    try {
        res.status(200).json(healthCheck);
    } catch (e) {
        healthCheck.message = e.message;
        res.status(503).json(healthCheck);
    }
});

app.use(route, router);

//Middlewares al final
app.use(logErrors);
app.use(boomErrorHandler);
app.use(sequelizeErrorHandler);
app.use(errorHandler);



module.exports = { app };