async function errorHandler(error, req, res, next) {
  console.log(error, "<<< iya ga");
  switch (error.name) {
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      res.status(400).json({ message: error.errors[0].message });
      break;
    case "Unauthorized":
      res.status(401).json({ message: error.message });
      break;
    case "JsonWebTokenError":
      res.status(401).json({ message: "Invalid token" });
      break;
    case "BadRequest":
      res.status(400).json({ message: error.message });
      break;
    case "Forbidden":
      res.status(403).json({ message: error.message });
      break;
    case "NotFound":
      res.status(404).json({ message: error.message });
      break;
    default:
      // Handle errors with status property (validation errors from use cases)
      if (error.status) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
      break;
  }
}

module.exports = errorHandler;
