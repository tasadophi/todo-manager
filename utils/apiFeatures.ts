import { Request } from "express";
import { Model } from "mongoose";

function apiFeatures<T>(Model: Model<T>, queryString: Request["query"]) {
  return {
    query: Model.find(),
    sort: function () {
      this.query = this.query.sort("-createdAt");
      return this;
    },
    paginate: async function () {
      const pageNumber = parseInt(queryString.page as string, 10) || 1;
      const limitNumber = parseInt(queryString.limit as string, 10) || 10;
      const offset = (pageNumber - 1) * limitNumber;
      const count = await this.query.clone().countDocuments();
      const items = await this.query.skip(offset).limit(limitNumber);
      const pages = Math.ceil(count / limitNumber);
      if (pageNumber > pages) throw new Error("page is not exist !");
      return { items, count, pages, page: pageNumber, limit: limitNumber };
    },
  };
}
export default apiFeatures;
