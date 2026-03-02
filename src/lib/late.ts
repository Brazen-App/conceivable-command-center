import Late from "@getlatedev/node";

// Late SDK client — reads LATE_API_KEY from env automatically
const late = new Late({
  apiKey: process.env.LATE_API_KEY,
});

export default late;
