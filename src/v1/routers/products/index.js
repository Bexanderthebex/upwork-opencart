import express from 'express';

import products from '../../controllers/products';
import errors from '../../../utils/errors';

export default function () {
  var router = express.Router();

  //create routes here
  router.get('/orders/total',
    getTotalOrders,
    returnProduct
  );
  
  router.get('/items/sold/most',
    getMostSoldItems,
    returnProduct
  );

  router.get('/items/available/most',
    getMostAvailableItems,
    returnProduct
  );

  //consider moving this to revenue api
  router.get('/revenue/top',
    getTopProductRevenue,
    returnProduct
  );

  router.get('/items/returned/most',
    getMostReturnedItems,
    returnProduct
  );

  router.get('/items/notifyme/most',
    getMostNotifyMeItems,
    returnProduct
  );

  //this one still have no data in the database yet
  router.get('/stocking/lastfour/report',
    getLastFourStockingReport,
    returnProduct
  );

  router.get('/item/return/lastest',
    getLatestItemReturn,
    returnProduct
  );

  router.get('/orders/latest',
    getLatestOrders,
    returnProduct
  );

  router.get('/',
    getProducts,
    returnProduct
  );

  //create functions here
  async function getProducts(req, res, next) {
    try {
      req.item = await products.getProducts(req.query);
      if (!req.item) {
        return next(new errors.NotFound('Products not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getTotalOrders(req, res, next) {
    try {
      req.item = await products.getTotalOrders();
      if (!req.item) {
        return next(new errors.NotFound('Total number of Orders not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getMostSoldItems (req, res, next) {
    try {
      req.item = await products.getMostSoldItems();
      if (!req.item) {
        return next(new errors.NotFound('Most sold items not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getMostAvailableItems (req, res, next) {
    try {
      req.item = await products.getMostAvailableItems();
      if (!req.item) {
        return next(new errors.NotFound('Most available items not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getTopProductRevenue (req, res, next) {
    try {
      req.item = await products.getTopProductRevenue();
      if (!req.item) {
        return next(new errors.NotFound('Top product revenue not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getMostReturnedItems (req, res, next) {
    try {
      req.item = await products.getMostReturnedItems();
      if (!req.item) {
        return next(new errors.NotFound('Most Returned Items not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getMostNotifyMeItems (req, res, next) {
    try {
      req.item = await products.getMostNotifyMeItems();
      if (!req.item) {
        return next(new errors.NotFound('Most Returned Items not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getLastFourStockingReport (req, res, next) {
    try {
      req.item = await products.getLastFourStockingReport();
      if (!req.item) {
        return next(new errors.NotFound('Most Returned Items not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getLatestItemReturn (req, res, next) {
    try {
      req.item = await products.getLatestItemReturn();
      if (!req.item) {
        return next(new errors.NotFound('Latest returned item not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getLatestOrders (req, res, next) {
    try {
      req.item = await products.getLatestOrders();
      if (!req.item) {
        return next(new errors.NotFound('latest orders not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  function returnProduct (req, res) {
    res.json(req.item);
  }

  return router;
}