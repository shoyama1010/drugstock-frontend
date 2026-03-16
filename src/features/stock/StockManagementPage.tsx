import { useState } from "react";
// import { SidebarLayout } from "../../components/layout/SidebarLayout";
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
} from "@mui/material";
import {
  Search,
  ArrowDownward,
  ArrowUpward,
  FileDownload,
} from "@mui/icons-material";

interface StockItem {
  id: number;
  name: string;
  sku: string;
  shelfNumber: string;
  stock: number;
  updatedAt: string;
}

const mockStockData: StockItem[] = [
  {
    id: 1,
    name: "ロキソニンS",
    sku: "MED-001",
    shelfNumber: "A-12",
    stock: 245,
    updatedAt: "2026-02-24 10:30",
  },
  {
    id: 2,
    name: "パブロンゴールドA",
    sku: "MED-002",
    shelfNumber: "A-13",
    stock: 15,
    updatedAt: "2026-02-24 09:15",
  },
  {
    id: 3,
    name: "ムヒS",
    sku: "MED-003",
    shelfNumber: "B-05",
    stock: 0,
    updatedAt: "2026-02-23 16:45",
  },
  {
    id: 4,
    name: "DHC ビタミンC",
    sku: "SUP-001",
    shelfNumber: "C-08",
    stock: 156,
    updatedAt: "2026-02-24 11:20",
  },
  {
    id: 5,
    name: "花王 アタックZERO",
    sku: "DLY-001",
    shelfNumber: "D-15",
    stock: 8,
    updatedAt: "2026-02-24 08:50",
  },
  {
    id: 6,
    name: "ライオン クリニカ",
    sku: "DLY-002",
    shelfNumber: "D-16",
    stock: 412,
    updatedAt: "2026-02-24 12:05",
  },
  {
    id: 7,
    name: "バファリンA",
    sku: "MED-004",
    shelfNumber: "A-14",
    stock: 198,
    updatedAt: "2026-02-24 10:15",
  },
  {
    id: 8,
    name: "目薬サンテFX",
    sku: "MED-005",
    shelfNumber: "B-03",
    stock: 0,
    updatedAt: "2026-02-22 14:30",
  },
  {
    id: 9,
    name: "マスク 50枚入",
    sku: "DLY-003",
    shelfNumber: "E-01",
    stock: 534,
    updatedAt: "2026-02-24 09:40",
  },
  {
    id: 10,
    name: "ポカリスエット",
    sku: "BEV-001",
    shelfNumber: "F-10",
    stock: 45,
    updatedAt: "2026-02-24 11:55",
  },
  {
    id: 11,
    name: "正露丸",
    sku: "MED-006",
    shelfNumber: "A-15",
    stock: 18,
    updatedAt: "2026-02-24 08:20",
  },
  {
    id: 12,
    name: "のど飴",
    sku: "FD-001",
    shelfNumber: "G-02",
    stock: 0,
    updatedAt: "2026-02-21 15:10",
  },
];

export default function StockManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredStock = mockStockData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return {
        label: "在庫切れ",
        color: "#d32f2f",
        bgColor: "#ffebee",
        textColor: "#d32f2f",
      };
    } else if (stock < 50) {
      return {
        label: "少量",
        color: "#ed6c02",
        bgColor: "#fff4e5",
        textColor: "#ed6c02",
      };
    } else {
      return {
        label: "十分",
        color: "#2e7d32",
        bgColor: "#e8f5e9",
        textColor: "#2e7d32",
      };
    }
  };

  const handleExportCSV = () => {
    // CSV header
    const headers = ["商品名", "SKU", "在庫数", "棚番号"];
    const csvRows = [headers.join(",")];

    // CSV data rows
    filteredStock.forEach((item) => {
      const row = [`"${item.name}"`, item.sku, item.stock, item.shelfNumber];
      csvRows.push(row.join(","));
    });

    // Create CSV content
    const csvContent = csvRows.join("\n");
    const bom = "\uFEFF"; // UTF-8 BOM for Excel compatibility
    const blob = new Blob([bom + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    // Download CSV file
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `在庫一覧_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth='xl' sx={{ py: 4 }}>
      {/* ページヘッダー */}
      <Typography variant='h4' fontWeight={600} gutterBottom sx={{ mb: 4 }}>
        在庫管理
      </Typography>

      {/* 検索バー */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder='商品名またはSKUで検索'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{
            bgcolor: "#ffffff",
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#1976d2",
              },
            },
          }}
        />
      </Box>

      {/* CSV Export Button */}
      <Box display='flex' justifyContent='flex-end' mb={2}>
        <Button
          variant='outlined'
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
          在庫CSV出力
        </Button>
      </Box>

      {/* データテーブル */}
      <Paper elevation={0} sx={{ border: "1px solid #e0e0e0" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 600 }}>商品名</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>SKU</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>棚番号</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align='right'>
                  現在庫数
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>状態</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>更新日時</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align='center'>
                  操作
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStock
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => {
                  const status = getStockStatus(item.stock);
                  return (
                    <TableRow
                      key={item.id}
                      hover
                      sx={{
                        "&:hover": {
                          bgcolor: "#f5f5f5",
                        },
                      }}
                    >
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <Box
                          component='span'
                          sx={{
                            fontFamily: "monospace",
                            bgcolor: "#f5f5f5",
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                          }}
                        >
                          {item.sku}
                        </Box>
                      </TableCell>
                      <TableCell>{item.shelfNumber}</TableCell>
                      <TableCell align='right'>
                        <Box
                          component='span'
                          sx={{
                            color: status.textColor,
                            fontWeight: 600,
                            fontSize: "1.1rem",
                          }}
                        >
                          {item.stock.toLocaleString()}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={status.label}
                          size='small'
                          sx={{
                            bgcolor: status.bgColor,
                            color: status.color,
                            fontWeight: 600,
                            borderRadius: 1,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>
                        {item.updatedAt}
                      </TableCell>
                      <TableCell align='center'>
                        <Box display='flex' gap={1} justifyContent='center'>
                          <Button
                            variant='outlined'
                            size='small'
                            startIcon={<ArrowDownward />}
                            disabled={item.stock === 0}
                            sx={{
                              minWidth: 90,
                              color: "#2e7d32",
                              borderColor: "#2e7d32",
                              "&:hover": {
                                borderColor: "#2e7d32",
                                bgcolor: "#e8f5e9",
                              },
                              "&.Mui-disabled": {
                                color: "#bdbdbd",
                                borderColor: "#e0e0e0",
                              },
                            }}
                          >
                            入庫
                          </Button>
                          <Button
                            variant='outlined'
                            size='small'
                            startIcon={<ArrowUpward />}
                            disabled={item.stock === 0}
                            sx={{
                              minWidth: 90,
                              color: "#d32f2f",
                              borderColor: "#d32f2f",
                              "&:hover": {
                                borderColor: "#d32f2f",
                                bgcolor: "#ffebee",
                              },
                              "&.Mui-disabled": {
                                color: "#bdbdbd",
                                borderColor: "#e0e0e0",
                              },
                            }}
                          >
                            出庫
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredStock.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage='表示件数:'
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} / ${count}件`
          }
        />
      </Paper>
    </Container>
  );
}
