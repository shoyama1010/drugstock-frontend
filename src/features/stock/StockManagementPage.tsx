import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/clients";
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
  product_id: number;
  name: string;
  sku: string;
  zone: string;
  aisle: string;
  shelf: string;
  total_stock: number;
  updated_at?: string;
}

export default function StockManagement() {
  const navigate = useNavigate();

  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 🔥 API取得
  const fetchStocks = async () => {
    try {
      const res = await api.get("/stocks");
      console.log("在庫API:", res.data);
      setStocks(res.data);
    } catch (error) {
      console.error("在庫取得失敗", error);
    }
  };

  // 初回ロード
  useEffect(() => {
    fetchStocks();

    const interval = setInterval(fetchStocks, 3000); // 3秒ごとに更新
    return () => clearInterval(interval);
  }, []);

  // 🔍 検索
  const filteredStock = stocks.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ページネーション
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 在庫状態
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
      const row = [
        `"${item.name}"`, item.sku, item.total_stock, `${item.zone}-${item.aisle}-${item.shelf}`,
      ];
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
                  const status = getStockStatus(item.total_stock);

                  return (
                    <TableRow
                      // key={item.id}
                      key={`${item.product_id}-${item.zone}-${item.aisle}-${item.shelf}`}
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

                      <TableCell>{item.zone}-{item.aisle}-{item.shelf}</TableCell>
                     
                      <TableCell align='right'>
                        <Box
                          component='span'
                          sx={{
                            color: status.textColor,
                            fontWeight: 600,
                            fontSize: "1.1rem",
                          }}
                        >
                          {item.total_stock.toLocaleString()}
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
                        {/* {item.updated_at} */}
                        {item.updated_at ?? "-"}
                      </TableCell>

                      <TableCell align='center'>
                        {/* 入庫 */}
                        <Box display='flex' gap={1} justifyContent='center'>
                          
                          <Button
                            variant='outlined'
                            size='small'
                            startIcon={<ArrowDownward />}
                            onClick={() => navigate("/stock-in")}
                            // disabled={item.total_stock === 0}
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

                          {/* 出庫 */}
                          <Button
                            variant='outlined'
                            size='small'
                            startIcon={<ArrowUpward />}
                            onClick={() => navigate("/stock-out")}
                            // disabled={item.total_stock === 0}
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
