const winston = require('winston');
const { combine, timestamp, printf, json } = winston.format;

// 自定义日志格式
const textFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// 创建logger实例
const logger = winston.createLogger({
  level: 'info', // 默认日志级别
  transports: [
    // 控制台输出(开发环境)
    new winston.transports.Console({
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        textFormat
      )
    }),
    
    // 文本格式日志文件
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        textFormat
      ),
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5
    }),
    
    // JSON格式错误日志
    new winston.transports.File({
      filename: 'logs/error.json',
      level: 'error',
      format: combine(
        timestamp(),
        json()
      ),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3
    })
  ]
});

// 添加请求日志中间件
logger.expressMiddleware = function(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
};

module.exports = logger;