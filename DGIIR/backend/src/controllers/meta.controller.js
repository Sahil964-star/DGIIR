import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const getDistricts = asyncHandler(async (req, res) => {
    const districts = await prisma.district.findMany();
    res.status(200).json({ status: 'success', data: { districts } });
});
export const getDepartments = asyncHandler(async (req, res) => {
    const departments = await prisma.department.findMany({ include: { categories: true } });
    res.status(200).json({ status: 'success', data: { departments } });
});
export const getCategories = asyncHandler(async (req, res) => {
    const categories = await prisma.category.findMany({ include: { department: true } });
    res.status(200).json({ status: 'success', data: { categories } });
});
//# sourceMappingURL=meta.controller.js.map