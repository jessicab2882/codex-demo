# Quick diagnostic for one broken row

Use the broken row number (example row 88).

## 1) Check name→email match
In `J88` paste:

```gs
=IFERROR(XLOOKUP(A88;Staff_Map!A:A;Staff_Map!B:B);"NO MATCH IN STAFF_MAP")
```

- If this shows `NO MATCH IN STAFF_MAP`, the name text in column `A` does not exactly match `Staff_Map`.

## 2) Check raw-tab date pull
In `K88` paste:

```gs
=IF(J88="NO MATCH IN STAFF_MAP";"STOP";IFERROR(MAXIFS(INDIRECT("'"&PROPER(LEFT(C88;3))&"_Raw'!A:A");INDIRECT("'"&PROPER(LEFT(C88;3))&"_Raw'!B:B");LOWER(J88));"NO DATE FOUND"))
```

- If this returns a date, the `F` formula should work for that row.
- If it says `NO DATE FOUND`, the raw tab has no exact email match.
