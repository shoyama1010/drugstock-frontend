import { useEffect, useState } from "react";
import axios from "axios";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import { Add, Search, Edit, Delete } from "@mui/icons-material";

interface Product {
  id: number;
  code: string;
  name: string;
  sku: string;
  category_id: number;
  unit_price: number;
  min_stock: number;
  is_active: boolean;
}

type ProductForm = {
  code: string;
  name: string;
  sku: string;
  category_id: number;
  unit_price: number;
  min_stock: number;
};

type ProductFormErrors = {
  code?: string;
  name?: string;
  sku?: string;
  category_id?: string;
  unit_price?: string;
  min_stock?: string;
  general?: string;
};

type ValidationErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

const initialForm: ProductForm = {
  code: "",
  name: "",
  sku: "",
  category_id: 1,
  unit_price: 0,
  min_stock: 0,
};

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [formErrors, setFormErrors] = useState<ProductFormErrors>({});

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Product & { code: string }>({
    id: 0,
    code: "",
    name: "",
    sku: "",
    category_id: 1,
    unit_price: 0,
    min_stock: 0,
    is_active: true,
  });
  const [editErrors, setEditErrors] = useState<ProductFormErrors>({});

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const buildFieldErrors = (
    errors?: Record<string, string[]>
  ): ProductFormErrors => {
    if (!errors) return {};

    return {
      code: errors.code?.[0],
      name: errors.name?.[0],
      sku: errors.sku?.[0],
      category_id: errors.category_id?.[0],
      unit_price: errors.unit_price?.[0],
      min_stock: errors.min_stock?.[0],
    };
  };

  const fetchProducts = async (): Promise<void> => {
    try {
      const res = await api.get<Product[]>("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("取得失敗", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async (): Promise<void> => {
    setFormErrors({});

    try {
      const res = await api.post<Product>("/products", form);
      console.log("登録成功", res.data);

      setOpen(false);
      setForm(initialForm);
      setFormErrors({});
      fetchProducts();
    } catch (error: unknown) {
      console.error("登録失敗", error);

      if (axios.isAxiosError<ValidationErrorResponse>(error)) {
        const status = error.response?.status;
        const responseData = error.response?.data;

        if (status === 422) {
          setFormErrors({
            ...buildFieldErrors(responseData?.errors),
            general: responseData?.message,
          });
          return;
        }

        setFormErrors({
          general: responseData?.message || "登録に失敗しました。",
        });
        return;
      }

      setFormErrors({
        general: "登録に失敗しました。",
      });
    }
  };

  const handleEditOpen = (product: Product & { code: string }): void => {
    setEditForm({
      id: product.id,
      code: product.code,
      name: product.name,
      sku: product.sku,
      category_id: product.category_id,
      unit_price: product.unit_price,
      min_stock: product.min_stock,
      is_active: product.is_active,
    });

    setEditErrors({});
    setEditOpen(true);
  };

  const handleUpdate = async (): Promise<void> => {
    setEditErrors({});

    try {
      const res = await api.put(`/products/${editForm.id}`, editForm);
      console.log("更新成功", res.data);

      setEditOpen(false);
      setEditErrors({});
      fetchProducts();
    } catch (error: unknown) {
      console.error("更新失敗", error);

      if (axios.isAxiosError<ValidationErrorResponse>(error)) {
        const status = error.response?.status;
        const responseData = error.response?.data;

        if (status === 422) {
          setEditErrors({
            ...buildFieldErrors(responseData?.errors),
            general: responseData?.message,
          });
          return;
        }

        setEditErrors({
          general: responseData?.message || "更新に失敗しました。",
        });
        return;
      }

      setEditErrors({
        general: "更新に失敗しました。",
      });
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
      setDeleteId(null);
    } catch (error) {
      console.error("削除失敗", error);
    }
  };

  const filteredProducts = products.filter((product) => {
    const keyword = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(keyword) ||
      product.sku.toLowerCase().includes(keyword)
    );
  });

  return (
    <Box>
      {/* 登録モーダル */}
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setFormErrors({});
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>商品登録</DialogTitle>

        <DialogContent>
          {formErrors.general && (
            <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
              {formErrors.general}
            </Alert>
          )}

          <TextField
            label="商品コード"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            fullWidth
            margin="dense"
            error={!!formErrors.code}
            helperText={formErrors.code || ""}
          />

          <TextField
            label="商品名"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
            margin="dense"
            error={!!formErrors.name}
            helperText={formErrors.name || ""}
          />

          <TextField
            label="SKU"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            fullWidth
            margin="dense"
            error={!!formErrors.sku}
            helperText={formErrors.sku || ""}
          />

          <TextField
            label="カテゴリID"
            type="number"
            value={form.category_id}
            onChange={(e) =>
              setForm({ ...form, category_id: Number(e.target.value) })
            }
            fullWidth
            margin="dense"
            error={!!formErrors.category_id}
            helperText={formErrors.category_id || ""}
          />

          <TextField
            label="価格"
            type="number"
            value={form.unit_price}
            onChange={(e) =>
              setForm({ ...form, unit_price: Number(e.target.value) })
            }
            fullWidth
            margin="dense"
            error={!!formErrors.unit_price}
            helperText={formErrors.unit_price || ""}
          />

          <TextField
            label="最小在庫"
            type="number"
            value={form.min_stock}
            onChange={(e) =>
              setForm({ ...form, min_stock: Number(e.target.value) })
            }
            fullWidth
            margin="dense"
            error={!!formErrors.min_stock}
            helperText={formErrors.min_stock || ""}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setFormErrors({});
            }}
          >
            キャンセル
          </Button>
          <Button onClick={handleCreate} variant="contained">
            登録
          </Button>
        </DialogActions>
      </Dialog>

      {/* 編集モーダル */}
      <Dialog
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditErrors({});
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>商品編集</DialogTitle>

        <DialogContent>
          {editErrors.general && (
            <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
              {editErrors.general}
            </Alert>
          )}

          <TextField
            label="商品コード"
            value={editForm.code}
            onChange={(e) =>
              setEditForm({ ...editForm, code: e.target.value })
            }
            fullWidth
            margin="dense"
            error={!!editErrors.code}
            helperText={editErrors.code || ""}
          />

          <TextField
            label="商品名"
            value={editForm.name}
            onChange={(e) =>
              setEditForm({ ...editForm, name: e.target.value })
            }
            fullWidth
            margin="dense"
            error={!!editErrors.name}
            helperText={editErrors.name || ""}
          />

          <TextField
            label="SKU"
            value={editForm.sku}
            onChange={(e) =>
              setEditForm({ ...editForm, sku: e.target.value })
            }
            fullWidth
            margin="dense"
            error={!!editErrors.sku}
            helperText={editErrors.sku || ""}
          />

          <TextField
            label="カテゴリID"
            type="number"
            value={editForm.category_id}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                category_id: Number(e.target.value),
              })
            }
            fullWidth
            margin="dense"
            error={!!editErrors.category_id}
            helperText={editErrors.category_id || ""}
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
            error={!!editErrors.unit_price}
            helperText={editErrors.unit_price || ""}
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
            error={!!editErrors.min_stock}
            helperText={editErrors.min_stock || ""}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setEditOpen(false);
              setEditErrors({});
            }}
          >
            キャンセル
          </Button>
          <Button variant="contained" onClick={handleUpdate}>
            更新
          </Button>
        </DialogActions>
      </Dialog>

      {/* 削除確認モーダル */}
      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>削除確認</DialogTitle>
        <DialogContent>本当に削除しますか？</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>キャンセル</Button>
          <Button
            color="error"
            onClick={async () => {
              if (deleteId !== null) {
                await handleDelete(deleteId);
              }
            }}
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>

      {/* <Typography variant="h4" mb={2}> */}
      <Typography
        variant="h4"
        fontWeight={600}
        gutterBottom
        sx={{ mb: 4 }}
      >
        商品管理
      </Typography>

      {/* 検索 */}
      <TextField
        fullWidth
        placeholder="商品名またはSKUで検索"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      {/* 商品登録ボタン */}
      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{ mb: 2 }}
        onClick={() => {
          setForm(initialForm);
          setFormErrors({});
          setOpen(true);
        }}
      >
        商品登録
      </Button>

      {/* テーブル */}
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
                  <IconButton
                    color="primary"
                    onClick={() => handleEditOpen(product)}
                  >
                    <Edit />
                  </IconButton>

                  <IconButton
                    color="error"
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

