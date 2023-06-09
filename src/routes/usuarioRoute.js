const express = require("express");
const { validatorHandler } = require("../middlewares/validator");
const {
    getUsuarioSchema,
    createUsuarioSchema,
    updateUsuarioSchema,
    createUsuariosSchema,
} = require("../schemas/usuarioSchema");
const {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    createUsuarios,
    getRecommendations,
    getUsuarioByUsername,
} = require("../controllers/usuarioController");
const {
    ingredientesPorUsuarioRoute,
    ingredientesPorUsuarioRouter,
} = require("./ingredientesPorUsuarioRoute");
const {
    platillosPorUsuarioRoute,
    platillosPorUsuarioRouter,
} = require("./platillosPorUsuarioRoute");
const {
    pedidosPorUsuarioRoute,
    pedidosPorUsuarioRouter,
} = require("./pedidosPorUsuarioRoute");
const {
    platillosVistosPorUsuarioRoute,
    platillosVistosPorUsuarioRouter,
} = require("./platillosVistosPorUsuarioRoute");

const usuarioRoute = "/usuarios";
const usuarioRouter = express.Router();

usuarioRouter.get("/", async (req, res, next) => {
    try {
        const usuarios = await getAllUsuarios();
        res.json({
            message: "Usuarios obtenidos correctamente",
            body: usuarios,
        });
    } catch (error) {
        next(error);
    }
});

usuarioRouter.get(
    "/:id",
    validatorHandler(getUsuarioSchema, "params"),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const usuario = await getUsuarioById(id);
            res.json({
                message: "Usuario obtenido correctamente",
                body: usuario,
            });
        } catch (error) {
            next(error);
        }
    }
);

usuarioRouter.get("/u/:username", async (req, res, next) => {
    try {
        const { username } = req.params;
        const usuario = await getUsuarioByUsername(username);
        res.json({
            message: "Usuario obtenido correctamente",
            body: usuario,
        });
    } catch (error) {
        next(error);
    }
});

usuarioRouter.get(
    "/:id/recommendations",
    validatorHandler(getUsuarioSchema, "params"),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const platillos = await getRecommendations(id);
            res.json({
                message: "Platillos obtenidos correctamente",
                body: platillos,
            });
        } catch (error) {
            next(error);
        }
    }
);

usuarioRouter.post(
    "/",
    validatorHandler(createUsuarioSchema),
    async (req, res, next) => {
        try {
            const usuario = await createUsuario(req.body);
            res.status(201).json({
                message: "Usuario creado correctamente",
                body: usuario,
            });
        } catch (error) {
            next(error);
        }
    }
);

usuarioRouter.post(
    "/multiple",
    validatorHandler(createUsuariosSchema),
    async (req, res, next) => {
        try {
            const usuarios = await createUsuarios(req.body);
            res.status(201).json({
                message: "Usuario creado correctamente",
                body: usuarios,
            });
        } catch (error) {
            next(error);
        }
    }
);

usuarioRouter.patch(
    "/:id",
    validatorHandler(getUsuarioSchema, "params"),
    validatorHandler(updateUsuarioSchema),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const usuario = await updateUsuario(id, req.body);
            res.json({
                message: "Usuario actualizado correctamente",
                body: usuario,
            });
        } catch (error) {
            next(error);
        }
    }
);

usuarioRouter.delete(
    "/:id",
    validatorHandler(getUsuarioSchema, "params"),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            await deleteUsuario(id);
            res.json({ message: "Usuario eliminado correctamente" });
        } catch (error) {
            next(error);
        }
    }
);

usuarioRouter.use(ingredientesPorUsuarioRoute, ingredientesPorUsuarioRouter);
usuarioRouter.use(platillosPorUsuarioRoute, platillosPorUsuarioRouter);
usuarioRouter.use(
    platillosVistosPorUsuarioRoute,
    platillosVistosPorUsuarioRouter
);
usuarioRouter.use(pedidosPorUsuarioRoute, pedidosPorUsuarioRouter);

module.exports = { usuarioRoute, usuarioRouter };
