const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    info: {
      title: "MP-prj-backend API",
      version: "1.0.0",
      description: "MP-prj-backend with express",
    },
    host: "localhost:3000",
    basePath: "/",
  },
  apis: ["./routes/*.js", "./swagger/*"],
};

const specs = swaggereJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
