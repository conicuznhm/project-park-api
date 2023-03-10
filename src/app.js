require('dotenv').config()
const express = require('express');
const cors = require('cors');
const chalk = require('chalk');
const notFoundMW = require("./middlewares/not-found");
const errorMW = require("./middlewares/error");
const authRoute = require('./routes/auth-route');
const authenticateMiddleware = require('./middlewares/authenticate');
const userRoute = require('./routes/user-route');
const vehicleRoute = require('./routes/vehicle-route');
const parkRoute = require('./routes/park-route');
const offerRoute = require('./routes/offer-route');
const reserveRoute = require('./routes/reserve-route');
const offerMiddleware = require('./middlewares/offer');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoute)

app.use('/users', authenticateMiddleware, userRoute)
app.use('/vehicle', authenticateMiddleware, vehicleRoute)
app.use('/park', authenticateMiddleware, parkRoute)
app.use('/offer', authenticateMiddleware, offerMiddleware, offerRoute)//
app.use('/reserve', authenticateMiddleware, reserveRoute)


app.use(notFoundMW)
app.use(errorMW)


const port = process.env.PORT || 8000;
app.listen(port, () => console.log(chalk.yellowBright.bold(`server on port: ${port}...`)));




















//////// const { sequelize } = require('./models');
//////// sequelize.sync({ force: true });