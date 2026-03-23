import { Request, Response, NextFunction } from "express";
import { OrderDatabase } from "../../database/models/order";

export namespace OrderServices {
  // Add a new order
  export const add = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const newOrder = new OrderDatabase.model(req.body);
      const savedOrder = await newOrder.save();

      res.status(201).json({
        meta: {
          status: true,
          message: "Order added successfully",
        },
        data: savedOrder,
      });
    } catch (error) {
      next(error);
    }
  };

export const list = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type } = req.query; 
    const { id } = req.params; 

    let query: any = {};

    if (type === "member") {
      query.memberId = id; // Query by memberId
    } else if (type === "family") {
      query.familyId = id; // Query by familyId
    } else if (type === "all") {
      // No query filters applied for "all"
      query = {}; 
    } else {
      return res.status(400).json({
        meta: {
          status: false,
          message: "Invalid type parameter. Must be 'member', 'family', or 'all'",
        },
      });
    }

    // Fetch orders based on the constructed query
    const orders = await OrderDatabase.model.find(query);

    res.status(200).json({
      meta: {
        status: true,
        message: "Orders retrieved successfully",
      },
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

  export const edit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { customerId, ...updateData } = req.body;

      // Prevent modification of `customerId`
      if (customerId) {
        return res.status(400).json({
          meta: {
            status: false,
            message: "`customerId` cannot be modified",
          },
        });
      }

      const updatedOrder = await OrderDatabase.model.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({
          meta: {
            status: false,
            message: "Order not found",
          },
        });
      }

      res.status(200).json({
        meta: {
          status: true,
          message: "Order updated successfully",
        },
        data: updatedOrder,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get details of a specific order
  export const details = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const order = await OrderDatabase.model.findById(id);

      if (!order) {
        return res.status(404).json({
          meta: {
            status: false,
            message: "Order not found",
          },
        });
      }

      res.status(200).json({
        meta: {
          status: true,
          message: "Order details retrieved successfully",
        },
        data: order,
      });
    } catch (error) {
      next(error);
    }
  };

  // Remove a specific order
  export const remove = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const deletedOrder = await OrderDatabase.model.findByIdAndDelete(id);

      if (!deletedOrder) {
        return res.status(404).json({
          meta: {
            status: false,
            message: "Order not found",
          },
        });
      }

      res.status(200).json({
        meta: {
          status: true,
          message: "Order removed successfully",
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
