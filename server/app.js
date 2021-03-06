const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { ApolloServer } = require("apollo-server-express");
const { generateToken, authorize } = require("./util/jwt");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const app = express();
const Sequelize = require("sequelize");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolver");

app.use(authorize);

//postgres
let sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  { host: process.env.POSTGRES_HOST, dialect: "postgres" }
);

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

//apollo-server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({
    access_token: req.access_token || "",
  }),
});

server.applyMiddleware({ app });

module.exports = app;
