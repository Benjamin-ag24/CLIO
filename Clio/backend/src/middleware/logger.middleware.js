const logger = (req, res, next) => {
  const start = new Date();

  res.on("finish", () => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const statusCode = res.statusCode;
    console.log(`[${timestamp}] ${method} ${url} ${statusCode}`);
  });

  next();
};

export default logger;
