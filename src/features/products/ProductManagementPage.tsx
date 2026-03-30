
import { useEffect, useState } from "react";
import api from "../../api/clients";
import {
  Box,
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
  IconButton,
} from "@mui/material";
import { Add, Search, Edit, Delete } from "@mui/icons-material";

// ✅ APIの型に合わせる
interface Product {
  id: number;
  name: string;
  sku: string;
  category_id: number;
  unit_price: number;
  min_stock: number;
  is_active: boolean;
}

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // ===============================
  // ✅ 商品登録（追加）
  // ===============================
  const handleCreate = async () => {
    console.log("クリックされた！");

    try {
      const res = await api.post("/products", {
        code: "P9999",
        name: "テスト商品",
        sku: "TEST-001",
        category_id: 1,
        unit_price: 999,
        is_active: true,
      });

      console.log("登録成功", res.data);

      // 一覧再取得
      fetchProducts();

    } catch (err) {
      console.error("登録失敗", err);
    }
  };

  // ===============================
  // ✅ 一覧取得（API）
  // ===============================
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      console.log("API取得:", res.data);
      // Laravel paginate対応
      // setProducts(res.data.data || []);
      setProducts(res.data); // ←これだけ
    } catch (error) {
      console.error("取得失敗", error);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);


  // ===============================
  // ✅ 削除
  // ===============================
  const handleDelete = async (id: number) => {
    if (!confirm("削除しますか？")) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("削除失敗", error);
    }
  };

  // ===============================
  // 🔍 検索（フロント）
  // ===============================
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Box>
      <Typography variant='h4' mb={2}>
        商品管理
      </Typography>

      {/* 🔍 検索 */}
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
        sx={{ mb: 2 }}
      />

      {/* ➕ 商品登録 */}
      <Button variant='contained' startIcon={<Add />} sx={{ mb: 2 }} onClick={handleCreate}>
        商品登録
      </Button>

      {/* 📦 テーブル */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>商品名</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>カテゴリ</TableCell>
              <TableCell>価格</TableCell>
              <TableCell>最小在庫</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.category_id}</TableCell>
                <TableCell>{product.unit_price}</TableCell>
                <TableCell>{product.min_stock}</TableCell>

                <TableCell>
                  <IconButton color='primary'>
                    <Edit />
                  </IconButton>

                  <IconButton
                    color='error'
                    onClick={() => handleDelete(product.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}