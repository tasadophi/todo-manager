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
    filterByDate: function () {
      const getStartDate = () => {
        if (queryString.startDate) {
          const [year, month, day] = (queryString.startDate as string).split(
            "-"
          );
          const startDate = new Date(`${year}-${month}-${day}`);
          if (isNaN(startDate.getTime()))
            throw new Error("startDate is invalid date !");
          return { $gte: startDate };
        }
        return {};
      };
      const getEndDate = () => {
        if (queryString.endDate) {
          const [year, month, day] = (queryString.endDate as string).split("-");
          const endDate = new Date(`${year}-${month}-${day}`);
          if (isNaN(endDate.getTime()))
            throw new Error("endDate is invalid date !");
          return { $lt: endDate };
        }
        return {};
      };
      this.query = this.query.find({
        createdAt: {
          ...getStartDate(),
          ...getEndDate(),
        },
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
