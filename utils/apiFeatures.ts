import { Model } from "mongoose";

interface IPaginateParams {
  page?: number | string;
  limit?: number | string;
}

function apiFeatures<T>(Model: Model<T>) {
  return {
    query: Model.find(),
    paginate: async function ({ page, limit }: IPaginateParams) {
      const pageNumber = parseInt(page as string, 10) || 1;
      const limitNumber = parseInt(limit as string, 10) || 10;
      const offset = (pageNumber - 1) * limitNumber;
      const count = await this.query.clone().countDocuments();
      const items = await this.query.skip(offset).limit(limitNumber);
      const pages = Math.ceil(count / limitNumber);
      return { items, count, pages, page: pageNumber, limit: limitNumber };
    },
  };
}
export default apiFeatures;
