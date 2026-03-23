import { Request, Response, NextFunction } from "express";
import { MemberDatabase } from "../../database/models/member";
import { OrderDatabase } from "../../database/models/order";

export namespace MemberServices {
  // Method to add a new member
  export const add = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Create a new member document
      const newDoc = new MemberDatabase.model(req.body);

      // Save the new document to the database
      await newDoc.save();
      res.status(201).json({
        meta: {
          status: true,
          message: "Member added successfully",
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // Method to update an existing member
  export const edit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params; // Get member ID from URL params
      const updateData = req.body; // Get the update data from the request body

      // Find and update the member by ID
      const updatedDoc = await MemberDatabase.model.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true } // `new: true` returns the updated document
      );

      if (!updatedDoc) {
        return res.status(404).json({
          meta: {
            status: false,
            message: "Member not found",
          },
        });
      }

      res.json({
        meta: {
          status: true,
          message: "Member updated successfully",
        },
        data: updatedDoc,
      });
    } catch (error) {
      next(error);
    }
  };

  // Method to get details of a member
  export const details = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params; // Get member ID from URL params

      // Find the member by ID
      const member = await MemberDatabase.model.findById(id);
      const orders = await OrderDatabase.model.find({ _id: id });

      if (!member) {
        return res.status(404).json({
          meta: {
            status: false,
            message: "Member not found",
          },
        });
      }

      res.json({
        meta: {
          status: true,
          message: "Member details retrieved successfully",
        },
        data: member,
        orders: orders,
      });
    } catch (error) {
      next(error);
    }
  };

  export const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search } = req.query;
      const query: any = {};
  
      if (req.params.family) {
        query.familyId = req.params.family;
      }
  
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ];
      }
  
      const members = await MemberDatabase.model.find(query).lean();
  
      // attach orders + outstanding
      const membersWithOrders = await Promise.all(
        members.map(async (member: any) => {
          const orders = await OrderDatabase.model.find({ memberId: member._id }).lean();
  
          let totalOrders = 0;
          let totalCredit = 0;
  
          orders.forEach((order: any) => {
            // sum all orders
            order.orders.forEach((o: any) => {
              totalOrders += (o.price || 0) * (o.qty || 0);
            });
  
            // sum all credits
            order.paymentHistory.forEach((p: any) => {
              if (p.type === "Credit") {
                totalCredit += p.amount || 0;
              }
            });
          });
  
          const memberoutstanding = totalOrders - totalCredit;
  
          return {
            ...member,
            ordersData: orders,
            outstanding: Number(memberoutstanding.toFixed(2)),
          };
        })
      );
  
      res.json({
        meta: {
          status: true,
          message: "Members retrieved successfully",
        },
        data: membersWithOrders,
      });
    } catch (error) {
      next(error);
    }
  };
  


  // Method to remove a member by ID
  export const remove = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params; // Get member ID from URL params

      // Find and delete the member by ID
      const deletedMember = await MemberDatabase.model.findByIdAndDelete(id);

      if (!deletedMember) {
        return res.status(404).json({
          meta: {
            status: false,
            message: "Member not found",
          },
        });
      }

      res.json({
        meta: {
          status: true,
          message: "Member deleted successfully",
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // Method to prepare member details for printing
  export const print = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params; // Get member ID from URL params

      // Find the member by ID
      const member = await MemberDatabase.model.findById(id);

      if (!member) {
        return res.status(404).json({
          meta: {
            status: false,
            message: "Member not found",
          },
        });
      }

      // Example: Generate printable format (could be PDF or other format)
      // For simplicity, returning member data as-is
      res.json({
        meta: {
          status: true,
          message: "Member print data retrieved successfully",
        },
        data: member,
      });
    } catch (error) {
      next(error);
    }
  };
}
