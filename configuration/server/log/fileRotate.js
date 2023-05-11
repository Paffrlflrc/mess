import { resolve } from "path";

import { createStream } from "rotating-file-stream";

const transport = async () =>
  createStream(
    (time, index) => {
      const pad = (amount) => (amount > 9 ? "" : "0") + amount;
      if (!time) return "rotate.log";
      return `${time.getFullYear()}-${pad(time.getMonth() + 1)}-${pad(
        time.getDate()
      )}-${index}.log`;
    },
    {
      interval: "1d",
      intervalBoundary: true,
      maxFiles: 6,
      path: resolve(process.cwd(), "./logs/server/"),
      size: "9M",
    }
  );

export default transport;
