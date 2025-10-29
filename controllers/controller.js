import fs from "fs";
import path from "path";
import { Op, fn, col } from "sequelize";
import { sequelize } from "../models/sequelize.js";
import { Country } from "../models/country.js";
import { fetchCountries, fetchExchangeRates } from "../services/external.js";
import { generateSummaryImage } from "../utils/image.js";

function randMultiplier() {
  return Math.floor(Math.random() * 1001) + 1000;
}

export async function refresh(req, res) {
  let countriesData, rates;
  try {
    [countriesData, rates] = await Promise.all([fetchCountries(), fetchExchangeRates()]);
  } catch (err) {
    return res.status(503).json({
      error: "External data source unavailable",
      details: `Could not fetch data from ${err.message}`
    });
  }

  const t = await sequelize.transaction();
  try {
    const now = new Date();
    const rateMap = Object.fromEntries(Object.entries(rates).map(([k, v]) => [k.toUpperCase(), v]));

    for (const entry of countriesData) {
      const name = entry.name;
      const capital = entry.capital || null;
      const region = entry.region || null;
      const population = entry.population ? Number(entry.population) : null;
      let currency_code = null, exchange_rate = null, estimated_gdp = null;

      if (entry.currencies?.length && entry.currencies[0]?.code) {
        currency_code = entry.currencies[0].code;
        const rate = rateMap[currency_code.toUpperCase()];
        if (rate) {
          exchange_rate = rate;
          if (population && exchange_rate !== 0) {
            estimated_gdp = (population * randMultiplier()) / exchange_rate;
          } else estimated_gdp = 0;
        } else {
          exchange_rate = null;
          estimated_gdp = null;
        }
      } else {
        currency_code = null;
        exchange_rate = null;
        estimated_gdp = 0;
      }

      const flag_url = entry.flag || null;
      const existing = await Country.findOne({
        where: sequelize.where(fn("lower", col("name")), name.toLowerCase()),
        transaction: t
      });

      if (existing) {
        Object.assign(existing, {
          capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url, last_refreshed_at: now
        });
        await existing.save({ transaction: t });
      } else {
        await Country.create({
          name, capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url, last_refreshed_at: now
        }, { transaction: t });
      }
    }

    await t.commit();
    const total = await Country.count();
    const top5 = await Country.findAll({
      where: { estimated_gdp: { [Op.not]: null } },
      order: [["estimated_gdp", "DESC"]],
      limit: 5
    });
    await generateSummaryImage(total, top5.map(c => c.toJSON()), new Date());
    return res.json({ message: "Refresh successful", total_countries: total, last_refreshed_at: new Date().toISOString() });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAll(req, res) {
  const { region, currency, sort } = req.query;
  const where = {};
  if (region) where.region = region;
  if (currency) where.currency_code = currency;
  const order = sort === "gdp_desc" ? [["estimated_gdp", "DESC"]] : sort === "gdp_asc" ? [["estimated_gdp", "ASC"]] : [];
  try {
    const countries = await Country.findAll({ where, order });
    res.json(countries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getOne(req, res) {
  try {
    const name = req.params.name;
    const country = await Country.findOne({
      where: sequelize.where(fn("lower", col("name")), name.toLowerCase())
    });
    if (!country) return res.status(404).json({ error: "Country not found" });
    res.json(country);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function remove(req, res) {
  try {
    const name = req.params.name;
    const deleted = await Country.destroy({
      where: sequelize.where(fn("lower", col("name")), name.toLowerCase())
    });
    if (!deleted) return res.status(404).json({ error: "Country not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function status(req, res) {
  try {
    const total = await Country.count();
    const last = await Country.findOne({ order: [["last_refreshed_at", "DESC"]] });
    res.json({ total_countries: total, last_refreshed_at: last?.last_refreshed_at || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function serveImage(req, res) {
  const imgPath = path.resolve("cache/summary.png");
  if (!fs.existsSync(imgPath)) return res.status(404).json({ error: "Summary image not found" });
  res.sendFile(imgPath);
}
