import { Request } from "express";
import { Query } from "mongoose";

const disallowedSearchFields = [
  "_id",
  "createdAt",
  "updatedAt",
  "password",
  "page",
  "limit",
  "startDate",
  "endDate",
  "user",
];

function apiFeatures<T>(query: Query<T[], T>, queryString: Request["query"]) {
  return {
    query,
    searchByFields: function () {
      // search on boolean and string fields
      const fields: Record<string, unknown> = {};
      const booleanFilters: Record<string, boolean>[] = [];
      Object.keys(queryString).forEach((key) => {
        if (!disallowedSearchFields.includes(key)) {
          fields[key] = queryString[key];
        }
      });
      const strFilters: Record<
        string,
        {
          $regex: string;
          $options: string;
        }
      >[] = [];
      Object.keys(fields).forEach((key) => {
        if (["false", "true"].includes(fields[key] as string)) {
          booleanFilters.push({
            [key]: fields[key] === "false" ? false : true,
          });
        } else {
          strFilters.push({
            [key]: {
              $regex: fields[key] ? ".*" + fields[key] + ".*" : "",
              $options: "i",
            },
          });
        }
      });
      if (booleanFilters.length)
        this.query = this.query.find({
          $and: booleanFilters,
        });
      if (strFilters.length)
        this.query = this.query.find({
          $or: strFilters,
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
        return;
      };
      const getEndDate = () => {
        if (queryString.endDate) {
          const [year, month, day] = (queryString.endDate as string).split("-");
          const endDate = new Date(`${year}-${month}-${day}`);
          if (isNaN(endDate.getTime()))
            throw new Error("endDate is invalid date !");
          return { $lt: endDate };
        }
        return;
      };
      const getCreatedAt = () => {
        const startDate = getStartDate();
        const endDate = getEndDate();
        if (startDate || endDate)
          return {
            createdAt: {
              ...getStartDate(),
              ...getEndDate(),
            },
          };
        return;
      };
      getCreatedAt();
      this.query = this.query.find({
        ...getCreatedAt(),
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
