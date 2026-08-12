import { useState, useEffect } from "react";
import api from "../../api/clients";

import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
} from "@mui/material";
import {
  Search,
  CalendarToday,
  History,
  FileDownload,
} from "@mui/icons-material";

interface Transaction {
  id: number;
  date: string;
  productName: string;
  sku: string;
  type: "入庫" | "出庫";
  quantity: number;
  staff: string;
  reason?: string;
  location?: string;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<"全て" | "入庫" | "出庫">("全て");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data);
    } catch (error) {
      console.error("履歴取得失敗", error);
      setErrorMessage("入出庫履歴の取得に失敗しました。");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.staff.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transaction.location ?? "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDate = dateFilter
      ? transaction.date.startsWith(dateFilter)
      : true;

    const matchesType =
      typeFilter === "全て" ? true : transaction.type === typeFilter;

    return matchesSearch && matchesDate && matchesType;
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExportCSV = () => {
    const headers = ["日時", "商品名", "SKU", "棚番号", "種別", "数量", "担当者", "備考"];
    const csvRows = [headers.join(",")];

    filteredTransactions.forEach((transaction) => {
      const row = [
        transaction.date,
        `"${transaction.productName}"`,
        transaction.sku,
        transaction.location ?? "-",
        transaction.type,
        transaction.quantity,
        `"${transaction.staff}"`,
        transaction.reason ? `"${transaction.reason}"` : "",
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");
    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `入出庫履歴_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <History sx={{ fontSize: 32, color: "#1976d2", mr: 1.5 }} />
        
        <Typography variant="h4" fontWeight={600}>
          入出庫履歴
        </Typography>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      )}

      <Paper elevation={0} sx={{ border: "1px solid #e0e0e0", p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="subtitle1" fontWeight={600}>
            フィルター
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <Button
              variant="outlined"
              startIcon={<FileDownload />}
              onClick={handleExportCSV}
              sx={{
                color: "#1976d2",
                borderColor: "#1976d2",
                "&:hover": {
                  borderColor: "#1565c0",
                  bgcolor: "rgba(25, 118, 210, 0.04)",
                },
              }}
            >
              CSVダウンロード
            </Button>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, fontSize: "0.75rem" }}
            >
              ※現在の検索条件でCSVを出力します
            </Typography>
          </Box>
        </Box>

        <Box
          display="grid"
          gap={2}
          sx={{
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "2fr 1fr 1fr",
            },
          }}
        >
          <TextField
            fullWidth
            placeholder="商品名・SKU・担当者・棚番号で検索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            type="date"
            label="日付"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday />
                </InputAdornment>
              ),
            }}
          />

          <FormControl fullWidth>
            <InputLabel>種別</InputLabel>
            <Select
              value={typeFilter}
              label="種別"
              onChange={(e) =>
                setTypeFilter(e.target.value as "全て" | "入庫" | "出庫")
              }
            >
              <MenuItem value="全て">全て</MenuItem>
              <MenuItem value="入庫">入庫</MenuItem>
              <MenuItem value="出庫">出庫</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box mt={2} display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" color="text.secondary">
            検索結果:
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {filteredTransactions.length}件
          </Typography>
          {(searchQuery || dateFilter || typeFilter !== "全て") && (
            <Chip
              label="フィルターをクリア"
              size="small"
              onDelete={() => {
                setSearchQuery("");
                setDateFilter("");
                setTypeFilter("全て");
              }}
              sx={{ ml: 1 }}
            />
          )}
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ border: "1px solid #e0e0e0" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 600 }}>日時</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>商品名</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>SKU</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>棚番号</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">種別</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">数量</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>担当者</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>備考</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      該当するデータがありません
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      hover
                      sx={{
                        "&:hover": {
                          bgcolor: "#f5f5f5",
                        },
                      }}
                    >
                      <TableCell sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                        {transaction.date}
                      </TableCell>
                      <TableCell>{transaction.productName}</TableCell>
                      <TableCell>
                        <Box
                          component="span"
                          sx={{
                            fontFamily: "monospace",
                            bgcolor: "#f5f5f5",
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                          }}
                        >
                          {transaction.sku}
                        </Box>
                      </TableCell>
                      <TableCell>{transaction.location ?? "-"}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={transaction.type}
                          size="small"
                          sx={{
                            bgcolor:
                              transaction.type === "入庫" ? "#e8f5e9" : "#ffebee",
                            color:
                              transaction.type === "入庫" ? "#2e7d32" : "#d32f2f",
                            fontWeight: 600,
                            minWidth: 60,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          component="span"
                          sx={{
                            fontWeight: 600,
                            fontSize: "1.05rem",
                            color:
                              transaction.type === "入庫" ? "#2e7d32" : "#d32f2f",
                          }}
                        >
                          {transaction.type === "入庫" ? "+" : "-"}
                          {transaction.quantity.toLocaleString()}
                        </Box>
                      </TableCell>
                      <TableCell>{transaction.staff}</TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>
                        {transaction.reason || "-"}
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="表示件数:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}件`}
        />
      </Paper>
    </Container>
  );
}


// import { useState } from "react";

// import {
//   Box,
//   Container,
//   Typography,
//   Paper,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   Chip,
//   InputAdornment,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
// } from "@mui/material";
// import {
//   Search,
//   CalendarToday,
//   History,
//   FileDownload,
// } from "@mui/icons-material";

// interface Transaction {
//   id: number;
//   date: string;
//   productName: string;
//   sku: string;
//   type: "入庫" | "出庫";
//   quantity: number;
//   staff: string;
//   reason?: string;
// }

// const mockTransactions: Transaction[] = [
//   {
//     id: 1,
//     date: "2026-02-24 14:30",
//     productName: "ロキソニンS",
//     sku: "MED-001",
//     type: "入庫",
//     quantity: 50,
//     staff: "山田太郎",
//   },
//   {
//     id: 2,
//     date: "2026-02-24 13:15",
//     productName: "マスク 50枚入",
//     sku: "DLY-003",
//     type: "出庫",
//     quantity: 100,
//     staff: "佐藤花子",
//     reason: "店頭販売",
//   },
//   {
//     id: 3,
//     date: "2026-02-24 11:45",
//     productName: "パブロンゴールドA",
//     sku: "MED-002",
//     type: "入庫",
//     quantity: 30,
//     staff: "田中一郎",
//   },
//   {
//     id: 4,
//     date: "2026-02-24 10:20",
//     productName: "DHC ビタミンC",
//     sku: "SUP-001",
//     type: "出庫",
//     quantity: 25,
//     staff: "鈴木次郎",
//     reason: "店頭販売",
//   },
//   {
//     id: 5,
//     date: "2026-02-24 09:30",
//     productName: "花王 アタックZERO",
//     sku: "DLY-001",
//     type: "入庫",
//     quantity: 80,
//     staff: "山田太郎",
//   },
//   {
//     id: 6,
//     date: "2026-02-23 16:40",
//     productName: "ライオン クリニカ",
//     sku: "DLY-002",
//     type: "出庫",
//     quantity: 15,
//     staff: "佐藤花子",
//     reason: "店頭販売",
//   },
//   {
//     id: 7,
//     date: "2026-02-23 15:10",
//     productName: "バファリンA",
//     sku: "MED-004",
//     type: "入庫",
//     quantity: 60,
//     staff: "田中一郎",
//   },
//   {
//     id: 8,
//     date: "2026-02-23 14:25",
//     productName: "ポカリスエット",
//     sku: "BEV-001",
//     type: "出庫",
//     quantity: 40,
//     staff: "鈴木次郎",
//     reason: "店頭販売",
//   },
//   {
//     id: 9,
//     date: "2026-02-23 12:50",
//     productName: "目薬サンテFX",
//     sku: "MED-005",
//     type: "入庫",
//     quantity: 45,
//     staff: "山田太郎",
//   },
//   {
//     id: 10,
//     date: "2026-02-23 11:15",
//     productName: "ムヒS",
//     sku: "MED-003",
//     type: "出庫",
//     quantity: 20,
//     staff: "佐藤花子",
//     reason: "店頭販売",
//   },
//   {
//     id: 11,
//     date: "2026-02-23 10:30",
//     productName: "正露丸",
//     sku: "MED-006",
//     type: "入庫",
//     quantity: 35,
//     staff: "田中一郎",
//   },
//   {
//     id: 12,
//     date: "2026-02-22 16:20",
//     productName: "マスク 50枚入",
//     sku: "DLY-003",
//     type: "入庫",
//     quantity: 200,
//     staff: "山田太郎",
//   },
//   {
//     id: 13,
//     date: "2026-02-22 14:45",
//     productName: "ロキソニンS",
//     sku: "MED-001",
//     type: "出庫",
//     quantity: 30,
//     staff: "鈴木次郎",
//     reason: "店頭販売",
//   },
//   {
//     id: 14,
//     date: "2026-02-22 13:10",
//     productName: "DHC ビタミンC",
//     sku: "SUP-001",
//     type: "入庫",
//     quantity: 90,
//     staff: "田中一郎",
//   },
//   {
//     id: 15,
//     date: "2026-02-22 11:30",
//     productName: "花王 アタックZERO",
//     sku: "DLY-001",
//     type: "出庫",
//     quantity: 12,
//     staff: "佐藤花子",
//     reason: "破損",
//   },
// ];

// export default function Transactions() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [dateFilter, setDateFilter] = useState("");
//   const [typeFilter, setTypeFilter] = useState<"全て" | "入庫" | "出庫">(
//     "全て",
//   );
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const filteredTransactions = mockTransactions.filter((transaction) => {
//     const matchesSearch =
//       transaction.productName
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase()) ||
//       transaction.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       transaction.staff.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesDate = dateFilter
//       ? transaction.date.startsWith(dateFilter)
//       : true;

//     const matchesType =
//       typeFilter === "全て" ? true : transaction.type === typeFilter;

//     return matchesSearch && matchesDate && matchesType;
//   });

//   const handleChangePage = (_event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (
//     event: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleExportCSV = () => {
//     // CSV header
//     const headers = ["日時", "商品名", "SKU", "種別", "数量", "担当者", "備考"];
//     const csvRows = [headers.join(",")];

//     // CSV data rows
//     filteredTransactions.forEach((transaction) => {
//       const row = [
//         transaction.date,
//         `"${transaction.productName}"`,
//         transaction.sku,
//         transaction.type,
//         transaction.quantity,
//         `"${transaction.staff}"`,
//         transaction.reason ? `"${transaction.reason}"` : "",
//       ];
//       csvRows.push(row.join(","));
//     });

//     // Create CSV content
//     const csvContent = csvRows.join("\n");
//     const bom = "\uFEFF"; // UTF-8 BOM for Excel compatibility
//     const blob = new Blob([bom + csvContent], {
//       type: "text/csv;charset=utf-8;",
//     });

//     // Download CSV file
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute(
//       "download",
//       `入出庫履歴_${new Date().toISOString().split("T")[0]}.csv`,
//     );
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//       <Container maxWidth='xl' sx={{ py: 4 }}>
//         {/* ページヘッダー */}
//         <Box display='flex' alignItems='center' mb={4}>
//           <History
//             sx={{
//               fontSize: 32,
//               color: "#1976d2",
//               mr: 1.5,
//             }}
//           />
//           <Typography variant='h4' fontWeight={600}>
//             入出庫履歴
//           </Typography>
//         </Box>

//         {/* フィルターエリア */}
//         <Paper elevation={0} sx={{ border: "1px solid #e0e0e0", p: 3, mb: 3 }}>
//           <Box
//             display='flex'
//             justifyContent='space-between'
//             alignItems='flex-start'
//             mb={2}
//           >
//             <Typography variant='subtitle1' fontWeight={600}>
//               フィルター
//             </Typography>
//             <Box display='flex' flexDirection='column' alignItems='flex-end'>
//               <Button
//                 variant='outlined'
//                 startIcon={<FileDownload />}
//                 onClick={handleExportCSV}
//                 sx={{
//                   color: "#1976d2",
//                   borderColor: "#1976d2",
//                   "&:hover": {
//                     borderColor: "#1565c0",
//                     bgcolor: "rgba(25, 118, 210, 0.04)",
//                   },
//                 }}
//               >
//                 CSVダウンロード
//               </Button>
//               <Typography
//                 variant='caption'
//                 color='text.secondary'
//                 sx={{ mt: 0.5, fontSize: "0.75rem" }}
//               >
//                 ※現在の検索条件でCSVを出力します
//               </Typography>
//             </Box>
//           </Box>
//           <Box
//             display='grid'
//             gap={2}
//             sx={{
//               gridTemplateColumns: {
//                 xs: "1fr",
//                 sm: "1fr 1fr",
//                 md: "2fr 1fr 1fr",
//               },
//             }}
//           >
//             {/* 商品名検索 */}
//             <TextField
//               fullWidth
//               placeholder='商品名・SKU・担当者で検索'
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position='start'>
//                     <Search />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {/* 日付フィルター */}
//             <TextField
//               fullWidth
//               type='date'
//               label='日付'
//               value={dateFilter}
//               onChange={(e) => setDateFilter(e.target.value)}
//               InputLabelProps={{
//                 shrink: true,
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position='start'>
//                     <CalendarToday />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {/* 種別フィルター */}
//             <FormControl fullWidth>
//               <InputLabel>種別</InputLabel>
//               <Select
//                 value={typeFilter}
//                 label='種別'
//                 onChange={(e) =>
//                   setTypeFilter(e.target.value as "全て" | "入庫" | "出庫")
//                 }
//               >
//                 <MenuItem value='全て'>全て</MenuItem>
//                 <MenuItem value='入庫'>入庫</MenuItem>
//                 <MenuItem value='出庫'>出庫</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>

//           {/* フィルター情報表示 */}
//           <Box mt={2} display='flex' alignItems='center' gap={1}>
//             <Typography variant='body2' color='text.secondary'>
//               検索結果:
//             </Typography>
//             <Typography variant='body2' fontWeight={600}>
//               {filteredTransactions.length}件
//             </Typography>
//             {(searchQuery || dateFilter || typeFilter !== "全て") && (
//               <Chip
//                 label='フィルターをクリア'
//                 size='small'
//                 onDelete={() => {
//                   setSearchQuery("");
//                   setDateFilter("");
//                   setTypeFilter("全て");
//                 }}
//                 sx={{ ml: 1 }}
//               />
//             )}
//           </Box>
//         </Paper>

//         {/* データテーブル */}
//         <Paper elevation={0} sx={{ border: "1px solid #e0e0e0" }}>
//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow sx={{ bgcolor: "#f5f5f5" }}>
//                   <TableCell sx={{ fontWeight: 600 }}>日時</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>商品名</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>SKU</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }} align='center'>
//                     種別
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: 600 }} align='right'>
//                     数量
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>担当者</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>備考</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredTransactions.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={7} align='center' sx={{ py: 4 }}>
//                       <Typography variant='body2' color='text.secondary'>
//                         該当するデータがありません
//                       </Typography>
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   filteredTransactions
//                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                     .map((transaction) => (
//                       <TableRow
//                         key={transaction.id}
//                         hover
//                         sx={{
//                           "&:hover": {
//                             bgcolor: "#f5f5f5",
//                           },
//                         }}
//                       >
//                         <TableCell
//                           sx={{ color: "text.secondary", whiteSpace: "nowrap" }}
//                         >
//                           {transaction.date}
//                         </TableCell>
//                         <TableCell>{transaction.productName}</TableCell>
//                         <TableCell>
//                           <Box
//                             component='span'
//                             sx={{
//                               fontFamily: "monospace",
//                               bgcolor: "#f5f5f5",
//                               px: 1,
//                               py: 0.5,
//                               borderRadius: 1,
//                             }}
//                           >
//                             {transaction.sku}
//                           </Box>
//                         </TableCell>
//                         <TableCell align='center'>
//                           <Chip
//                             label={transaction.type}
//                             size='small'
//                             sx={{
//                               bgcolor:
//                                 transaction.type === "入庫"
//                                   ? "#e8f5e9"
//                                   : "#ffebee",
//                               color:
//                                 transaction.type === "入庫"
//                                   ? "#2e7d32"
//                                   : "#d32f2f",
//                               fontWeight: 600,
//                               minWidth: 60,
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell align='right'>
//                           <Box
//                             component='span'
//                             sx={{
//                               fontWeight: 600,
//                               fontSize: "1.05rem",
//                               color:
//                                 transaction.type === "入庫"
//                                   ? "#2e7d32"
//                                   : "#d32f2f",
//                             }}
//                           >
//                             {transaction.type === "入庫" ? "+" : "-"}
//                             {transaction.quantity.toLocaleString()}
//                           </Box>
//                         </TableCell>
//                         <TableCell>{transaction.staff}</TableCell>
//                         <TableCell sx={{ color: "text.secondary" }}>
//                           {transaction.reason || "-"}
//                         </TableCell>
//                       </TableRow>
//                     ))
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25, 50]}
//             component='div'
//             count={filteredTransactions.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//             labelRowsPerPage='表示件数:'
//             labelDisplayedRows={({ from, to, count }) =>
//               `${from}-${to} / ${count}件`
//             }
//           />
//         </Paper>
//       </Container>
//   );
// }
