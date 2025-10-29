import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize.js";

export const Country = sequelize.define(
  "Country",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    capital: { type: DataTypes.STRING },
    region: { type: DataTypes.STRING },
    population: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    currency_code: { type: DataTypes.STRING },
    exchange_rate: { type: DataTypes.DOUBLE },
    estimated_gdp: { type: DataTypes.DOUBLE },
    flag_url: { type: DataTypes.TEXT },
    last_refreshed_at: { type: DataTypes.DATE }
  },
  { tableName: "countries" }
);
