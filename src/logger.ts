// Logger implementation for Bless Network environment
const logger = {
  info: (message: string, ...args: any[]) => console.log(`[BLESS-INFO] ${message}`, ...args),
  error: (message: string, ...args: any[]) => console.error(`[BLESS-ERROR] ${message}`, ...args),
  warn: (message: string, ...args: any[]) => console.warn(`[BLESS-WARN] ${message}`, ...args),
  debug: (message: string, ...args: any[]) => console.log(`[BLESS-DEBUG] ${message}`, ...args)
};

export default logger;
