import { Router } from 'express';  // value import
import type { RequestHandler } from 'express';  // type import

const TryCatch = (handler: RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error: any) {
      console.error('❌ Error in TryCatch:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};

export default TryCatch;