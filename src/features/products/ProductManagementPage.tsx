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

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

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

  const [open, setOpen] = useState(false); // 追加
  const [form, setForm] = useState({ // 追加
    code: "",
    name: "",
    sku: "",
    category_id: 1,
    unit_price: 0,
    min_stock: 0,
  });

  const [editOpen, setEditOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    id: 0,
    code: "",
    name: "",
    sku: "",
    category_id: 1,
    unit_price: 0,
    min_stock: 0,
  });

  const [deleteId, setDeleteId] = useState<number | null>(null);

  // ===============================
  // ✅ 商品登録（追加）
  // ===============================
  const handleCreate = async () => {
    console.log("クリックされた！");

    try {
      const res = await api.post("/products", form);

      console.log("登録成功", res.data);

      // ✅ モーダル閉じる
      setOpen(false); // ダイアログを閉じる

      // ✅ フォーム初期化
      setForm({
        code: "",
        name: "",
        sku: "",
        category_id: 1,
        unit_price: 0,
        min_stock: 0,
      });

      // 一覧再取得
      fetchProducts();

    } catch (err: any) {
      console.error("登録失敗", err);

      // ✅ Laravelバリデーションエラー表示
      if (err.response?.data?.errors) {
        const messages = Object.values(err.response.data.errors)
          .flat()
          .join("\n");

        alert(messages);
      } else {
        alert("登録に失敗しました");
      }
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

  // 編集モーダル開く
  const handleEditOpen = (product: Product) => {
    setEditForm({
      id: product.id,
      code: product.code,
      name: product.name,
      sku: product.sku,
      category_id: product.category_id,
      unit_price: product.unit_price,
      min_stock: product.min_stock,
    });

    setEditOpen(true);
  };

  // 更新処理
  const handleUpdate = async () => {
    try {
      await api.put(`/products/${editForm.id}`, editForm);

      alert("更新成功");

      setEditOpen(false);

      fetchProducts(); // ←これ絶対必要

    } catch (error) {
      console.error("更新失敗", error);
      alert("更新失敗");
    }
  };

  // ===============================
  // ✅ 削除
  // ===============================
  const handleDelete = async (id: number) => {
    console.log("削除ID:", id);

    if (!confirm("削除しますか？")) return;

    try {
      console.log("API実行前");
      const res = await api.delete(`/products/${id}`);
      console.log("削除成功", res);
      
      fetchProducts();
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
    // 登録モーダル
    <Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>商品登録</DialogTitle>

        <DialogContent>
          <TextField
            label="商品コード"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            fullWidth
            margin="dense"
          />

          <TextField
            label="商品名"
            fullWidth
            margin="dense"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <TextField
            label="SKU"
            fullWidth
            margin="dense"
            value={form.sku}
            onChange={(e) =>
              setForm({ ...form, sku: e.target.value })
            }
          />

          <TextField
            label="価格"
            type="number"
            fullWidth
            margin="dense"
            value={form.unit_price}
            onChange={(e) =>
              setForm({ ...form, unit_price: Number(e.target.value) })
            }
          />

          <TextField
            label="最小在庫"
            type="number"
            fullWidth
            margin="dense"
            value={form.min_stock}
            onChange={(e) =>
              setForm({ ...form, min_stock: Number(e.target.value) })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>キャンセル</Button>
          <Button onClick={handleCreate} variant="contained">
            登録
          </Button>
        </DialogActions>
      </Dialog>


      {/* 編集モーダル */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>商品編集</DialogTitle>

        <DialogContent>
          <TextField
            label="商品コード"
            value={editForm.code}
            onChange={(e) =>
              setEditForm({ ...editForm, code: e.target.value })
            }
            fullWidth
            margin="dense"
          />

          <TextField
            label="商品名"
            value={editForm.name}
            onChange={(e) =>
              setEditForm({ ...editForm, name: e.target.value })
            }
            fullWidth
            margin="dense"
          />

          <TextField
            label="SKU"
            value={editForm.sku}
            onChange={(e) =>
              setEditForm({ ...editForm, sku: e.target.value })
            }
            fullWidth
            margin="dense"
          />

          <TextField
            label="価格"
            type="number"
            value={editForm.unit_price}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                unit_price: Number(e.target.value),
              })
            }
            fullWidth
            margin="dense"
          />

          <TextField
            label="最小在庫"
            type="number"
            value={editForm.min_stock}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                min_stock: Number(e.target.value),
              })
            }
            fullWidth
            margin="dense"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleUpdate}>
            更新
          </Button>
        </DialogActions>
      </Dialog>

      {/* 削除 */}
      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>削除確認</DialogTitle>
        <DialogContent>本当に削除しますか？</DialogContent>
        <DialogActions>

          <Button onClick={() => setDeleteId(null)}>キャンセル</Button>
          <Button
            color="error"
            onClick={async () => {
              await api.delete(`/products/${deleteId}`);
              fetchProducts();
              setDeleteId(null);
            }}
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>

      {/* *************************************** */}
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
      <Button variant='contained'
        startIcon={<Add />} sx={{ mb: 2 }}
        // onClick={handleCreate}>
        onClick={() => setOpen(true)}>
        商品登録
      </Button>
      {/* 📦 テーブル */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>商品コード</TableCell>
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
                <TableCell>{product.code}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.category_id}</TableCell>
                <TableCell>{product.unit_price}</TableCell>
                <TableCell>{product.min_stock}</TableCell>

                <TableCell>
                  <IconButton color='primary'
                    onClick={() => handleEditOpen(product)}
                  >
                    <Edit />
                  </IconButton>

                  <IconButton
                    color='error'
                    // onClick={() => handleDelete(product.id)}
                    onClick={() => setDeleteId(product.id)}
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