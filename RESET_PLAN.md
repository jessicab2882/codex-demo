# Reset Plan (Known-Good Baseline)

Use this when formulas got mixed up.

## 1) Make a backup first
- File → Make a copy

## 2) Keep only this column layout in `Master_Tracker`
- A Staff Name
- B Role
- C Month
- D Education Topic
- E Date Sent
- F Date Returned
- G Date Uploaded to HealthTrust
- H Final Compliance
- I Days Overdue

## 3) Clear formula columns only
- Clear contents in `D2:D`, `F2:F`, `H2:H`, `I2:I`
- Do **not** clear manual columns `A:C`, `E`, `G`

## 4) Re-paste these formulas

`D2`
```gs
=IF(C2="";"";XLOOKUP(C2;Topic_List!A:A;Topic_List!B:B;""))
```

`F2`
```gs
=LET(abbr,IF(ISNUMBER(C2),TEXT(C2,"mmm"),PROPER(LEFT(TRIM(C2),3))),sh,abbr&"_Raw",masterKey,IFERROR(UPPER(REGEXEXTRACT(A2,"^[^,]+")&REGEXEXTRACT(A2,",\s*([A-Za-z])")),REGEXREPLACE(UPPER(A2),"[^A-Z]","")),mapKeys,ARRAYFORMULA(IF(Staff_Map!$A:$A="","",IFERROR(UPPER(REGEXEXTRACT(Staff_Map!$A:$A,"^[^,]+")&REGEXEXTRACT(Staff_Map!$A:$A,",\s*([A-Za-z])")),REGEXREPLACE(UPPER(Staff_Map!$A:$A),"[^A-Z]","")))),em,LOWER(XLOOKUP(masterKey,mapKeys,Staff_Map!$B:$B,"")),d,IFERROR(MAXIFS(INDIRECT("'"&sh&"'!A:A"),INDIRECT("'"&sh&"'!B:B"),em),0),IF(OR(A2="",C2="",em="",d=0),"",d))
```

`H2`
```gs
=IF(OR(A2="";C2="";E2="");"";IF(AND(F2<>"";G2<>"");"Complete";IF(AND(F2="";TODAY()>EOMONTH(DATEVALUE("1 "&PROPER(C2)&" "&YEAR(TODAY()));0));"Overdue";"In Progress")))
```

`I2`
```gs
=IF(H2="Overdue";TODAY()-EOMONTH(DATEVALUE("1 "&PROPER(C2)&" "&YEAR(TODAY()));0);0)
```

## 5) Fill down
- Fill `D2`, `F2`, `H2`, `I2` down all active rows

## 6) Validate with 2 known people
- Pick one known February responder and one known March responder
- Confirm `F` populates
- Confirm `G` remains your manual upload date
