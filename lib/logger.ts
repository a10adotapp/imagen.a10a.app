import pino from "pino";
import { ZodError } from "zod";

const loggerSingleton = () => {
  return pino({
    formatters: {
      log: (value) => {
        if (value instanceof ZodError) {
          return {
            error: formatZodError(value),
          };
        }

        if (value instanceof Error) {
          return {
            error: formatError(value),
          };
        }

        if (value instanceof Object) {
          if (value.error instanceof ZodError) {
            return {
              ...value,
              error: formatZodError(value.error),
            };
          }

          if (value.error instanceof Error) {
            return {
              ...value,
              error: formatError(value.error),
            };
          }
        }

        return value;
      },
    },
  });
};

const logger = loggerSingleton();

export default logger;

function formatError(err: Error): Record<string, unknown> {
  return {
    message: err.message,
    stack:
      err.stack
        ?.split("\n")
        .map((chunk) => {
          return chunk.trim();
        })
        .filter((chunk) => {
          return (
            !chunk.includes("node_modules") &&
            !chunk.includes("node:internal") &&
            /^at/.test(chunk)
          );
        }) || [],
  };
}

function formatZodError(err: ZodError): Record<string, unknown> {
  return {
    message: "invalid values",
    invalid_values: err.issues.map((issue) => {
      const messageChunks = [`[${issue.path?.join(",") || "."}]`];

      if ("received" in issue) {
        messageChunks.push(`${issue.received}`);
      }

      if ("expected" in issue) {
        messageChunks.push(`(expected: ${issue.expected})`);
      }

      return messageChunks.join(" ");
    }),
    stack:
      err.stack
        ?.split("\n")
        .map((chunk) => {
          return chunk.trim();
        })
        .filter((chunk) => {
          return (
            !chunk.includes("node_modules") &&
            !chunk.includes("node:internal") &&
            /^at/.test(chunk)
          );
        }) || [],
  };
}
