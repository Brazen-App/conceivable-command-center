import Late from "@getlatedev/node";

// Late SDK client — lazy singleton so the module can be imported
// even when LATE_API_KEY is not set (e.g. during build / page data collection).
let _late: Late | null = null;

function getLate(): Late {
  if (!_late) {
    _late = new Late({ apiKey: process.env.LATE_API_KEY });
  }
  return _late;
}

export default getLate;
