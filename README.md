# Forex-Exchange-API
The Forex Exchange API is a powerful and reliable RESTful API that provides real-time and historical foreign exchange (forex) data for global currency pairs. It enables developers, traders, and financial applications to access accurate market rates, perform currency conversions, and analyze forex trends with ease.

---
## 🚀 Features

- Fetch all countries with optional filters and sorting  
- Retrieve details of a single country  
- Delete a country from the database  
- Refresh database with the latest country data  
- Serve country flag images  
- Fully integrated with MySQL via Sequelize ORM  

---

## 🧠 Tech Stack

- **Backend:** Node.js + Express  
- **Database:** MySQL (via Sequelize ORM)  
- **Environment Variables:** dotenv  
- **Validation:** express-validator  
- **Deployment:** Railway  

---
## 🗂️ Project Structure
```bash
        Forex-Exchange-API/
        │
        ├── controllers/
        │ └── controller.js # Handles logic for fetching, creating, deleting, and refreshing data
        │
        ├── models/
        │ ├── country.js # Sequelize model for Country table
        │ └── sequelize.js # Database connection and Sequelize setup
        │
        ├── routes/
        │ └── route.js # Express route definitions
        │
        ├── .env # Environment variables (not committed)
        ├── .gitignore # Ignored files and folders
        ├── index.js # Entry point – starts the Express app and DB connection
        ├── package.json # Dependencies and scripts
        └── README.md # Project documentation

```

---

## ⚙️ Setup & Installation

### 1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/forex-exchange-api.git
   cd forex-exchange-api
```
### 2. Install dependencies
```bash
npm install express cors body-parser
```

### 3. Run the server
```bash
npm start
```
### 4. Development mode (auto-restart)
```bash
npm run dev
```

---

## 🧩 API Endpoint
| Method   | Endpoint                          | Description                          |
| -------- | --------------------------------- | ------------------------------------ |
| `GET`    | `/status`                         | Check API status                     |
| `POST`   | `/countries/refresh`              | Refresh country data                 |
| `GET`    | `/countries`                      | Get all countries (supports filters) |
| `GET`    | `/countries/:name`                | Get a specific country               |
| `DELETE` | `/countries/:name`                | Delete a country                     |
| `GET`    | `/countries/image`                | Get a country flag image             |

Query Parameters for `/countries`
- region – filter by region
- currency – filter by currency
- sort – sort by GDP (gdp_desc or gdp_asc)

