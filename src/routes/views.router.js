import express from 'express';

const viewsRouter = express.Router();

// Ruta raiz
viewsRouter.get('/', (req, res) => {
    res.render('index');
});

export default viewsRouter;