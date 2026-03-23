import { Request, Response, NextFunction } from "express";
import { LeadsDatabase } from "../../database/models/leads";


export namespace LeadsServices {
    export const add = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const newDoc = new LeadsDatabase.model(req.body);

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
            const leads = await LeadsDatabase.model.find().lean();

            res.json({
                meta: {
                    status: true,
                    message: "Records retrieved successfully",
                },
                data: leads,
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

            const updatedDoc = await LeadsDatabase.model.findByIdAndUpdate(
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

            const deletedDoc = await LeadsDatabase.model.findByIdAndDelete(id);

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
