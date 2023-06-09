const express = require("express");
const { validatorHandler } = require("../middlewares/validator");
const {
    getPlatilloSchema,
    createPlatilloSchema,
    updatePlatilloSchema,
    createPlatillosSchema,
} = require("../schemas/platilloSchema");
const {
    getAllPlatillos,
    getPlatilloById,
    createPlatillo,
    updatePlatillo,
    deletePlatillo,
    createPlatillos,
    searchPlatillos,
} = require("../controllers/platilloController");
const {
    categoriasPorPlatilloRoute,
    categoriasPorPlatilloRouter,
} = require("./categoriasPorPlatilloRoute");
const {
    etiquetasPorPlatilloRoute,
    etiquetasPorPlatilloRouter,
} = require("./etiquetasPorPlatilloRoute");
const {
    ingredientesPorPlatilloRoute,
    ingredientesPorPlatilloRouter,
} = require("./ingredientesPorPlatilloRoute");

const platilloRoute = "/platillos";
const platilloRouter = express.Router();

platilloRouter.get("/", async (req, res, next) => {
    try {
        const platillos = await getAllPlatillos();
        res.json({
            message: "Platillos obtenidos correctamente",
            body: platillos,
        });
    } catch (error) {
        next(error);
    }
});

platilloRouter.get("/search", async (req, res, next) => {
    try {
        const platillos = await searchPlatillos(req.query);
        res.json({
            message: "Platillos obtenidos correctamente",
            body: platillos,
        });
    } catch (error) {
        next(error);
    }
});

platilloRouter.get(
    "/:id",
    validatorHandler(getPlatilloSchema, "params"),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const platillo = await getPlatilloById(id);
            res.json({
                message: "Platillo obtenido correctamente",
                body: platillo,
            });
        } catch (error) {
            next(error);
        }
    }
);

platilloRouter.post(
    "/",
    validatorHandler(createPlatilloSchema),
    async (req, res, next) => {
        try {
            const platillo = await createPlatillo(req.body);
            res.status(201).json({
                message: "Platillo creado correctamente",
                body: platillo,
            });
        } catch (error) {
            next(error);
        }
    }
);

platilloRouter.post(
    "/multiple",
    validatorHandler(createPlatillosSchema),
    async (req, res, next) => {
        try {
            const platillos = await createPlatillos(req.body);
            res.status(201).json({
                message: "Platillos creados correctamente",
                body: platillos,
            });
        } catch (error) {
            next(error);
        }
    }
);

platilloRouter.patch(
    "/:id",
    validatorHandler(updatePlatilloSchema),
    validatorHandler(getPlatilloSchema, "params"),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const platillo = await updatePlatillo(id, req.body);
            res.json({
                message: "Platillo actualizado correctamente",
                body: platillo,
            });
        } catch (error) {
            next(error);
        }
    }
);

platilloRouter.delete(
    "/:id",
    validatorHandler(getPlatilloSchema, "params"),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            await deletePlatillo(id);
            res.json({ message: "Platillo eliminado correctamente" });
        } catch (error) {
            next(error);
        }
    }
);

platilloRouter.use(categoriasPorPlatilloRoute, categoriasPorPlatilloRouter);
platilloRouter.use(etiquetasPorPlatilloRoute, etiquetasPorPlatilloRouter);
platilloRouter.use(ingredientesPorPlatilloRoute, ingredientesPorPlatilloRouter);

module.exports = { platilloRoute, platilloRouter };
