# Monthly Education Compliance Tracker (Simple Version)

You do **not** need to code.

This file is only a copy/paste reference for your Google Sheet.

## Tabs to keep
- `Master_Tracker`
- `Staff_Roster`
- `Staff_Map`
- `Month`
- `Dashboard`
- `Topic_List`
- monthly raw tabs like `Jan_Raw`, `Feb_Raw`, `Mar_Raw`...

## Copy/paste formulas

### 1) `Staff_Map!A2`
```gs
=FILTER(Staff_Roster!A2:A;Staff_Roster!C2:C="Active")
```

### 2) `Staff_Map!B2`
```gs
=ARRAYFORMULA(IF(A2:A="";"";LOWER(XLOOKUP(A2:A;Staff_Roster!A:A;Staff_Roster!D:D;""))))
```

### 3) `Master_Tracker!D2` (topic)
```gs
=IF(C2="";"";XLOOKUP(C2;Topic_List!A:A;Topic_List!B:B;""))
```

### 4) `Master_Tracker!F2` (date returned)
```gs
=LET(abbr,IF(ISNUMBER(C2),TEXT(C2,"mmm"),PROPER(LEFT(TRIM(C2),3))),sh,abbr&"_Raw",masterKey,IFERROR(UPPER(REGEXEXTRACT(A2,"^[^,]+")&REGEXEXTRACT(A2,",\s*([A-Za-z])")),REGEXREPLACE(UPPER(A2),"[^A-Z]","")),mapKeys,ARRAYFORMULA(IF(Staff_Map!$A:$A="","",IFERROR(UPPER(REGEXEXTRACT(Staff_Map!$A:$A,"^[^,]+")&REGEXEXTRACT(Staff_Map!$A:$A,",\s*([A-Za-z])")),REGEXREPLACE(UPPER(Staff_Map!$A:$A),"[^A-Z]","")))),em,LOWER(XLOOKUP(masterKey,mapKeys,Staff_Map!$B:$B,"")),d,IFERROR(MAXIFS(INDIRECT("'"&sh&"'!A:A"),INDIRECT("'"&sh&"'!B:B"),em),0),IF(OR(A2="",C2="",em="",d=0),"",d))
```

### 5) `Master_Tracker!H2` (final compliance)
```gs
=IF(OR(A2="";C2="";E2="");"";IF(AND(F2<>"";G2<>"");"Complete";IF(AND(F2="";TODAY()>EOMONTH(DATEVALUE("1 "&PROPER(C2)&" "&IF(E2<>"";YEAR(E2);YEAR(TODAY())));0));"Overdue";"In Progress")))
```

### 6) `Master_Tracker!I2` (days overdue)
```gs
=IF(H2="Overdue";TODAY()-EOMONTH(DATEVALUE("1 "&PROPER(C2)&" "&IF(E2<>"";YEAR(E2);YEAR(TODAY())));0);0)
```

## If you get a spill error in `Staff_Map!B2`
- Clear `B3:B`.
- Keep formula only in `B2`.
- If needed, use this non-spill formula in `B2` and fill down:

```gs
=IF(A2="";"";LOWER(XLOOKUP(A2;Staff_Roster!A:A;Staff_Roster!D:D;"")))
```
