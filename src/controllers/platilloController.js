const boom = require("@hapi/boom");
const { Op } = require("sequelize");

const { Categoria } = require("../models/categoria");
const { CategoriasPorPlatillo } = require("../models/categoriasPorPlatillo");
const { Etiqueta } = require("../models/etiqueta");
const { EtiquetasPorPlatillo } = require("../models/etiquetasPorPlatillo");
const { Ingrediente } = require("../models/ingrediente");
const {
    IngredientesPorPlatillo,
} = require("../models/ingredientesPorPlatillo");
const { Platillo } = require("../models/platillo");

async function getAllPlatillos() {
    try {
        const platillos = await Platillo.findAll({ include: ["local"] });
        return platillos;
    } catch (error) {
        throw error;
    }
}

function formatPlatillo(platillo) {
    const extractedData = {
        name: platillo.name,
        description: platillo.description,
        photoUrl: platillo.photoUrl,
        price: platillo.price,
    };

    extractedData.local = {
        id: platillo.local.id,
        name: platillo.local.name,
        photoUrl: platillo.local.photoUrl,
    };

    extractedData.categorias = platillo.categorias.map(
        (categoria) => categoria.categoria.name
    );
    extractedData.etiquetas = platillo.etiquetas.map(
        (etiqueta) => etiqueta.etiqueta.name
    );
    extractedData.ingredientes = platillo.ingredientes.map(
        (ingrediente) => ingrediente.ingrediente.name
    );

    return extractedData;
}

async function getPlatilloById(id) {
    try {
        const platillo = await Platillo.findByPk(id, {
            include: [
                "local",
                {
                    model: CategoriasPorPlatillo,
                    as: "categorias",
                    include: {
                        model: Categoria,
                        as: "categoria",
                    },
                },
                {
                    model: EtiquetasPorPlatillo,
                    as: "etiquetas",
                    include: {
                        model: Etiqueta,
                        as: "etiqueta",
                    },
                },
                {
                    model: IngredientesPorPlatillo,
                    as: "ingredientes",
                    include: {
                        model: Ingrediente,
                        as: "ingrediente",
                    },
                },
            ],
        });
        if (!platillo) throw boom.notFound("Platillo no encontrado");

        return formatPlatillo(platillo);
    } catch (error) {
        throw error;
    }
}

async function getPlatillosByIds(ids) {
    try {
        const platillos = await Platillo.findAll({
            where: { id: ids },
            include: ["local"],
        });
        return platillos;
    } catch (error) {
        throw error;
    }
}

async function searchPlatillos(query) {
    try {
        const { q, ingredientes, categorias, etiquetas } = query;
        const where = {
            [Op.or]: [
                { name: { [Op.iLike]: `%${q}%` } },
                { description: { [Op.iLike]: `%${q}%` } },
            ],
        };

        if (ingredientes) {
            const ingredientesArray = ingredientes.split(",");
            where["$ingredientes.ingrediente.name$"] = {
                [Op.in]: ingredientesArray,
            };
        }

        if (categorias) {
            const ingredientesArray = categorias.split(",");
            where["$categorias.categoria.name$"] = {
                [Op.in]: ingredientesArray,
            };
        }

        if (etiquetas) {
            const etiquetasArray = etiquetas.split(",");
            where["$etiquetas.etiqueta.name$"] = {
                [Op.in]: etiquetasArray,
            };
        }

        const platillos = await Platillo.findAll({
            where,
            include: [
                "local",
                {
                    model: CategoriasPorPlatillo,
                    as: "categorias",
                    include: {
                        model: Categoria,
                        as: "categoria",
                    },
                },
                {
                    model: EtiquetasPorPlatillo,
                    as: "etiquetas",
                    include: {
                        model: Etiqueta,
                        as: "etiqueta",
                    },
                },
                {
                    model: IngredientesPorPlatillo,
                    as: "ingredientes",
                    include: {
                        model: Ingrediente,
                        as: "ingrediente",
                    },
                },
            ],
        });

        // return platillos.map((platillo) => formatPlatillo(platillo));
        return platillos.map((platillo) => {
            return {
                id: platillo.id,
                name: platillo.name,
                price: platillo.price,
                local: platillo.local.name,
                photoUrl: platillo.photoUrl,
            };
        });
    } catch (error) {
        throw error;
    }
}

async function createPlatillo(platillo) {
    try {
        const newPlatillo = await Platillo.create(platillo);
        return newPlatillo;
    } catch (error) {
        throw error;
    }
}

async function createPlatillos(platillos) {
    try {
        const createdPlatillos = await Platillo.bulkCreate(platillos);
        return createdPlatillos;
    } catch (error) {
        throw error;
    }
}

async function updatePlatillo(id, platillo) {
    try {
        const [rowsUpdated, [updatedPlatillo]] = await Platillo.update(
            platillo,
            {
                returning: true,
                where: { id },
            }
        );
        if (rowsUpdated !== 1) throw boom.notFound("Platillo no encontrado");

        return updatedPlatillo;
    } catch (error) {
        throw error;
    }
}

async function deletePlatillo(id) {
    try {
        const rowsDeleted = await Platillo.destroy({ where: { id } });
        if (rowsDeleted !== 1) throw boom.notFound("Platillo no encontrado");
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllPlatillos,
    getPlatilloById,
    getPlatillosByIds,
    searchPlatillos,
    createPlatillo,
    createPlatillos,
    updatePlatillo,
    deletePlatillo,
};
