import { Request, Response, NextFunction } from "express";
import { FamilyDatabase } from "../../database/models/family";
import { MemberDatabase } from "../../database/models/member";
import { OrderDatabase } from "../../database/models/order";

export namespace FamilyServices {
  export const add = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const newDoc = new FamilyDatabase.model(req.body);

      const saveDoc = await newDoc.save();
      res.json({
        meta: {
          status: true,
          message: "success",
        },
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
      const { search } = req.query;

      const query: any = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { city: { $regex: search, $options: "i" } },
          { state: { $regex: search, $options: "i" } },
          { note: { $regex: search, $options: "i" } },
        ];
      }

      const families = await FamilyDatabase.model
        .find(query)
        .populate("members")
        .lean();

      const familiesWithOutstanding = await Promise.all(
        families.map(async (family: any) => {
          let familyOutstanding = 0;

          const membersWithOutstanding = await Promise.all(
            (family.members || []).map(async (member: any) => {
              const orders = await OrderDatabase.model
                .find({ memberId: member._id })
                .lean();

              let totalOrders = 0;
              let totalCredit = 0;

              orders.forEach((order: any) => {
                order.orders.forEach((o: any) => {
                  totalOrders += (o.price || 0) * (o.qty || 0);
                });

                order.paymentHistory.forEach((p: any) => {
                  if (p.type === "Credit") {
                    totalCredit += p.amount || 0;
                  }
                });
              });

              const outstanding = totalOrders - totalCredit;
              familyOutstanding += outstanding; // ✅ add to family total

              return {
                ...member,
                ordersData: orders,
                outstanding: Number(familyOutstanding.toFixed(2)),
              };
            })
          );

          return {
            ...family,
            members: membersWithOutstanding,
            outstanding: familyOutstanding, // ✅ family-level outstanding
          };
        })
      );

      res.json({
        meta: {
          status: true,
          message: "Records retrieved successfully",
        },
        data: familiesWithOutstanding,
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
      const { id } = req.params; // Assuming `id` is passed as a route parameter
      const updateData = req.body;

      const updatedDoc = await FamilyDatabase.model.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true } // `new: true` returns the updated document
      );

      if (!updatedDoc) {
        return res.status(404).json({
          meta: {
            status: false,
            message: "Record not found",
          },
        });
      }

      res.json({
        meta: {
          status: true,
          message: "Record updated successfully",
        },
        data: updatedDoc,
      });
    } catch (error) {
      next(error);
    }
  };

  export const remove = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      const deletedDoc = await FamilyDatabase.model.findByIdAndDelete(id);

      if (!deletedDoc) {
        return res.status(404).json({
          meta: {
            status: false,
            message: "Record not found",
          },
        });
      }

      res.json({
        meta: {
          status: true,
          message: "Record deleted successfully",
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
