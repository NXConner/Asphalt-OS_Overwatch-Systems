type LogLevel = "debug" | "info" | "warn" | "error";

function write(level: LogLevel, message: string, data?: unknown) {
  const payload = { level, message, ...((data && typeof data === "object") ? { data } : {}) };
  // eslint-disable-next-line no-console
  console[level === "debug" ? "log" : level](JSON.stringify(payload));
}

export const log = {
  debug: (msg: string, data?: unknown) => write("debug", msg, data),
  info: (msg: string, data?: unknown) => write("info", msg, data),
  warn: (msg: string, data?: unknown) => write("warn", msg, data),
  error: (msg: string, data?: unknown) => write("error", msg, data),
};
