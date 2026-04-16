# Fix for your actual broken row (79)

Good catch. In your screenshot, `D79` references `C78` (wrong row reference).

## Do this
1. Click row `78` cells `D78`, `F78`, `H78`, `I78` (working formula row).
2. Copy.
3. Paste **formulas only** into row `79` cells `D79`, `F79`, `H79`, `I79`.

This will reset row 79 formulas to the correct row references (`C79`, etc.).
