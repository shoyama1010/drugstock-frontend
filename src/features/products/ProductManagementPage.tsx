import { useState } from "react";

import {
  Box,
  Container,
  Typography,
  Button,
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
  IconButton,
  Chip,
} from "@mui/material";
import { Add, Search, Edit, Delete } from "@mui/icons-material";

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  shelfNumber: string;
  stock: number;
  lastUpdated: string;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "ロキソニンS",
    sku: "MED-001",
    category: "医薬品",
    shelfNumber: "A-12",
    stock: 245,
    lastUpdated: "2026-02-20",
  },
  {
    id: 2,
    name: "パブロンゴールドA",
    sku: "MED-002",
    category: "医薬品",
    shelfNumber: "A-13",
    stock: 180,
    lastUpdated: "2026-02-21",
  },
  {
    id: 3,
    name: "ムヒS",
    sku: "MED-003",
    category: "医薬品",
    shelfNumber: "B-05",
    stock: 320,
    lastUpdated: "2026-02-22",
  },
  {
    id: 4,
    name: "DHC ビタミンC",
    sku: "SUP-001",
    category: "サプリメント",
    shelfNumber: "C-08",
    stock: 156,
    lastUpdated: "2026-02-19",
  },
  {
    id: 5,
    name: "花王 アタックZERO",
    sku: "DLY-001",
    category: "日用品",
    shelfNumber: "D-15",
    stock: 89,
    lastUpdated: "2026-02-23",
  },
  {
    id: 6,
    name: "ライオン クリニカ",
    sku: "DLY-002",
    category: "日用品",
    shelfNumber: "D-16",
    stock: 412,
    lastUpdated: "2026-02-21",
  },
  {
    id: 7,
    name: "バファリンA",
    sku: "MED-004",
    category: "医薬品",
    shelfNumber: "A-14",
    stock: 198,
    lastUpdated: "2026-02-22",
  },
  {
    id: 8,
    name: "目薬サンテFX",
    sku: "MED-005",
    category: "医薬品",
    shelfNumber: "B-03",
    stock: 267,
    lastUpdated: "2026-02-20",
  },
  {
    id: 9,
    name: "マスク 50枚入",
    sku: "DLY-003",
    category: "日用品",
    shelfNumber: "E-01",
    stock: 534,
    lastUpdated: "2026-02-23",
  },
  {
    id: 10,
    name: "ポカリスエット",
    sku: "BEV-001",
    category: "飲料",
    shelfNumber: "F-10",
    stock: 145,
    lastUpdated: "2026-02-22",
  },
];

export default function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredProducts = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()),
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "医薬品":
        return "error";
      case "サプリメント":
        return "warning";
      case "日用品":
        return "info";
      case "飲料":
        return "success";
      default:
        return "default";
    }
  };

  const getStockColor = (stock: number) => {
    if (stock < 100) return "#d32f2f";
    if (stock < 200) return "#ed6c02";
    return "#2e7d32";
  };

  return (
    <Container maxWidth='xl' sx={{ py: 4 }}>
      {/* ページヘッダー */}
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={4}
      >
        <Typography variant='h4' fontWeight={600}>
          商品管理
        </Typography>
        <Button
          variant='contained'
          startIcon={<Add />}
          sx={{
            bgcolor: "#1976d2",
            px: 3,
            py: 1,
            "&:hover": {
              bgcolor: "#1565c0",
            },
          }}
        >
          商品登録
        </Button>
      </Box>

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

      {/* データテーブル */}
      <Paper elevation={0} sx={{ border: "1px solid #e0e0e0" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 600 }}>商品名</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>SKU</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>カテゴリ</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>棚番号</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align='right'>
                  在庫数
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>最終更新日</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align='center'>
                  操作
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow
                    key={product.id}
                    hover
                    sx={{
                      "&:hover": {
                        bgcolor: "#f5f5f5",
                      },
                    }}
                  >
                    <TableCell>{product.name}</TableCell>
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
                        {product.sku}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.category}
                        color={getCategoryColor(product.category)}
                        size='small'
                      />
                    </TableCell>
                    <TableCell>{product.shelfNumber}</TableCell>
                    <TableCell align='right'>
                      <Box
                        component='span'
                        sx={{
                          color: getStockColor(product.stock),
                          fontWeight: 600,
                        }}
                      >
                        {product.stock.toLocaleString()}
                      </Box>
                    </TableCell>
                    <TableCell>{product.lastUpdated}</TableCell>
                    <TableCell align='center'>
                      <IconButton size='small' sx={{ color: "#1976d2", mr: 1 }}>
                        <Edit fontSize='small' />
                      </IconButton>
                      <IconButton size='small' sx={{ color: "#d32f2f" }}>
                        <Delete fontSize='small' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredProducts.length}
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
