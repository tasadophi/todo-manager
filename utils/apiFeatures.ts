import { Request } from "express";
import { FilterQuery, Model } from "mongoose";

function apiFeatures<T>(Model: Model<T>, queryString: Request["query"]) {
  return {
    query: Model.find(),
    searchOnStrFields: function (fields: {
      [x: string]: Request["query"][keyof Request["query"]];
    }) {
      const filters = Object.keys(fields)
        .map((key) => ({
          [key]: { $regex: fields[key] ? ".*" + fields[key] + ".*" : "" },
        }))
        .filter(
          (filter) =>
            Object.values(filter).filter((value) => !!value.$regex).length
        );
      if (filters.length)
        this.query = this.query.find({
          $or: filters as FilterQuery<T>[],
        });
      return this;
    },
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
      if (pages && pageNumber > pages) throw new Error("page is not exist !");
      return { items, count, pages, page: pageNumber, limit: limitNumber };
    },
  };
}
export default apiFeatures;
