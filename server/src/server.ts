import app from './app';
import { PORT } from './config';

// textToRecipe(TEST_RECIPE_TEXT);
app.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});
