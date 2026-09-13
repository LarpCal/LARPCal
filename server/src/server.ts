import app from "./app.ts";
import { PORT } from "./config.ts";

app.listen(PORT, () => {
  console.log(`Started on http://localhost:${PORT}`);
});
