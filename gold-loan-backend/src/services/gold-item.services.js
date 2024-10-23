import * as models from '../models/index.js'
import httpStatus from 'http-status';
import { responseHelper } from '../utils/response.helper.js';
import { paginateData } from '../utils/pagination-data.js';

const defaultPageLimit = process.env.PAGE_LIMIT;

const transFormImageUploadResponseArray = (imageResponseArray) => {
    return imageResponseArray.map((image) => ({
        name: image.originalname,
        fileName: image.filename,
        path: `/cdn/uploads/images/${image.filename}`,
        uploadedDate: new Date(),
    }));
};

export async function viewGoldItem(req, res) {
    try {

        let { pageLimit, orderBy = 'createdAt', search = null, order } = req.query;
        pageLimit = parseInt(pageLimit || defaultPageLimit);
        const page = parseInt(req.query.page) || 1;
        order = order == 'asc' ? 1 : -1;
        let sort = {};
        const query = {};
        if (search) {
            query.$or = [
                { goldItem: { $regex: new RegExp(search, 'i') } }
            ];
        }

        let itemsData = await models.goldItemModel.find(query).select(
            'goldItem goldImage goldDescription createdAt'
        ).collation({ locale: 'en', strength: 2 });

        if (orderBy === 'goldName') {
            itemsData.sort((a, b) => a.goldName.localeCompare(b.goldName) * order);
        } else {
            itemsData.sort((a, b) => (a.createdAt - b.createdAt) * order); // Default sorting by createdAt
        }

        if (search) {
            // Define a function to calculate relevance score
            const calculateRelevance = (itemsData) => {
                const fields = ['goldName'];
                let relevance = 0;
                fields.forEach((field) => {
                    if (
                        itemsData[field] &&
                        itemsData[field].toLowerCase().startsWith(search.toLowerCase())
                    ) {
                        relevance++;
                    }
                });
                return relevance;
            };
            itemsData.sort((a, b) => calculateRelevance(b) - calculateRelevance(a));
        }
        if (!itemsData) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'Gold items not found'
            );
        }
        const paginationResult = await paginateData(itemsData, page, pageLimit);
        //apply orderBy and order
        paginationResult.pagination.orderBy = orderBy;
        paginationResult.pagination.order = order;

        return responseHelper(res, httpStatus.OK, false, 'gold Items', {
            items: paginationResult.data,
            pagination: paginationResult.pagination,
        });

    } catch {
        return next(new Error(error));
    }

}

export async function addGoldItem(req, res) {
    try {
        let { goldItem, goldDescription } = req.body;
        let { goldImage } = req.files;

        const items = await models.goldItemModel.findOne({ goldItem });
        if (items) {
            return responseHelper(
                res,
                httpStatus.CONFLICT,
                true,
                'Gold item already exists'
            );
        }

        const item = await models.goldItemModel.create({
            goldItem,
            goldDescription,
            //  goldImage,
        });
        if (goldImage && goldImage.length > 0) {
            item.goldImage = transFormImageUploadResponseArray(goldImage)[0];
        }
        await item.save();
        return responseHelper(
            res,
            httpStatus.CREATED,
            false,
            'Gold item added successfully',
            { role: item }
        );
    } catch (error) {
        return next(new Error(error));
    }

}

export async function updateGoldItemById(req, res) {
    try {
        let { goldItem, goldDescription } = req.body;
        let { goldImage } = req.files;
        const { itemId } = req.params;
        let images = {};

        const item = await models.goldItemModel.findById(itemId);
        if (!item) {
            return responseHelper(res, httpStatus.NOT_FOUND, true, 'Item not found');
        }
        const existingItem = await models.goldItemModel.findOne({
            goldItem,
            _id: { $ne: itemId },
        });
        if (existingItem) {
            return responseHelper(
                res,
                httpStatus.CONFLICT,
                true,
                `Item already exists: ${existingItem.goldItem}`
            );
        }

        if (
            (goldImage && goldImage[0])
        ) {
            images = {
                item: req.files.goldImage
                    ? transFormImageUploadResponseArray(goldImage)[0]
                    : existingItem.goldImage,
            };
        }

        const updateItem = await models.goldItemModel.findByIdAndUpdate(
            itemId,
            { goldDescription, goldImage: images.item, goldItem },
            {
                new: true,
            }
        );
        return responseHelper(
            res,
            httpStatus.OK,
            false,
            'Role is updated successfully',
            { item: updateItem }
        );
    } catch (error) {
        return next(new Error(error));
    }

}

export async function removeGoldItem(req, res) {
    try {
        const { itemId } = req.params
        let item = await models.goldItemModel.findById(itemId);
        if (!item) {
            return responseHelper(
                res, httpStatus.NOT_FOUND,
                true,
                'item not found',
            )
        }
        await models.goldItemModel.findByIdAndDelete(itemId)
        return responseHelper(
            res, httpStatus.OK,
            false,
            'item deleted',
        )

    } catch {
        return next(new Error(error));
    }
}

export async function viewGoldItemById(req, res) {
    try {
        const { itemId } = req.params
        let item = await models.goldItemModel.findById(itemId);
        if (!item) {
            return responseHelper(
                res, httpStatus.NOT_FOUND,
                true,
                'item not found',
            )
        }
        return responseHelper(
            res, httpStatus.OK,
            false,
            'gold item',
            item
        )

    } catch {
        return next(new Error(error));
    }
}