import { Request, Response, NextFunction } from "express";

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const asyncHandler = (requestHandler: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(requestHandler(req, res, next)).catch((err: Error) => next(err));
  };
};

export { asyncHandler };
