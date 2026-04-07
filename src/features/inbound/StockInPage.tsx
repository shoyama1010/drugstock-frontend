import { useState, useEffect } from "react";
import api from "../../api/clients";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
} from "@mui/material";
import { ArrowDownward, Save } from "@mui/icons-material";

interface Product {
  id: number;
  name: string;
  sku: string;
  unit_price?: number;
  min_stock?: number;
  is_active?: boolean;
}

export default function StockIn() {
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [quantity, setQuantity] = useState("");
  const [shelfNumber, setShelfNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (error) {
        console.error(error);
        setErrorMessage("商品一覧の取得に失敗しました。");
      }
    };

    fetchProducts();
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleProductChange = (productId: number) => {
    setSelectedProductId(productId);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!selectedProductId) {
      setErrorMessage("商品を選択してください。");
      return;
    }

    // if (!quantity || parseInt(quantity, 10) <= 0) {
    //   setErrorMessage("入庫数量は1以上の数値を入力してください。");
    //   return;
    // }

    if (parseInt(quantity, 10) > 10000) {
      setErrorMessage("入庫数量は10,000以下で入力してください。");
      return;
    }

    if (!shelfNumber.trim()) {
      setErrorMessage("棚番号を入力してください。");
      return;
    }

    try {
      const formattedShelf = shelfNumber.toUpperCase().trim();

      const res = await api.post("/stocks/in", {
        product_id: selectedProductId,
        lot_number: `LOT-${Date.now()}`,
        quantity: parseInt(quantity, 10),
        expiry_date: null,
        shelf: formattedShelf,
      });

      const product = products.find((p) => p.id === selectedProductId);

      if (res.data?.allocations && Array.isArray(res.data.allocations)) {
        const allocationText = res.data.allocations
          .map((a: { shelf: string; quantity: number }) => `${a.shelf} に ${a.quantity}個`)
          .join(" / ");

        setSuccessMessage(
          `${product?.name}（SKU: ${product?.sku}）を${quantity}個入庫しました。 ${allocationText}`
        );
      } else {
        setSuccessMessage(
          `${product?.name}（SKU: ${product?.sku}）を${quantity}個入庫しました。棚番号: ${formattedShelf}`
        );
      }

      setSelectedProductId("");
      setQuantity("");
      setShelfNumber("");
    } catch (error: any) {
      console.error("🔥エラー詳細↓↓↓↓");
      console.error(error.response?.data);

      setErrorMessage(
        error.response?.data?.message || "入庫失敗しました"
      );
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <ArrowDownward
          sx={{
            fontSize: 32,
            color: "#2e7d32",
            mr: 1.5,
          }}
        />
        <Typography variant="h4" fontWeight={600}>
          入庫処理
        </Typography>
      </Box>

      {errorMessage && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setErrorMessage("")}
        >
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSuccessMessage("")}
        >
          {successMessage}
        </Alert>
      )}

      <Paper elevation={0} sx={{ border: "1px solid #e0e0e0", p: 4 }}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="product-select-label">商品選択</InputLabel>
            <Select
              labelId="product-select-label"
              value={selectedProductId}
              label="商品選択"
              onChange={(e) => handleProductChange(Number(e.target.value))}
            >
              <MenuItem value="">
                <em>選択してください</em>
              </MenuItem>

              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedProduct && (
            <Box
              sx={{
                bgcolor: "#f5f5f5",
                p: 2,
                mb: 3,
                borderRadius: 1,
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                選択中の商品情報
              </Typography>
              <Box display="flex" gap={3} mt={1}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    商品名
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {selectedProduct.name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    SKU
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ fontFamily: "monospace" }}
                  >
                    {selectedProduct.sku}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          <TextField
            fullWidth
            label="入庫数量"
            type="number"
            value={quantity || ''}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="入庫する数量を入力"
            InputProps={{
              inputProps: { min: 1, max: 10000 },
            }}
            sx={{ mb: 3 }}
            helperText="1〜10,000の範囲で入力してください"
          />

          <TextField
            fullWidth
            label="棚番号"
            value={shelfNumber}
            onChange={(e) => setShelfNumber(e.target.value)}
            placeholder="例: A-1-01"
            sx={{ mb: 3 }}
            helperText="商品を保管する棚の番号を入力してください"
          />

          <Divider sx={{ my: 3 }} />

          <Box display="flex" gap={2}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<Save />}
              sx={{
                flex: 1,
                bgcolor: "#2e7d32",
                py: 1.5,
                "&:hover": {
                  bgcolor: "#1b5e20",
                },
              }}
            >
              入庫登録
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
              }}
              onClick={() => {
                setSelectedProductId("");
                setQuantity("");
                setShelfNumber("");
                setErrorMessage("");
                setSuccessMessage("");
              }}
            >
              クリア
            </Button>
          </Box>
        </form>

        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>注意事項：</strong>
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            component="ul"
            sx={{ pl: 2 }}
          >
            <li>入庫数量は必ず実際の数量を確認してから入力してください。</li>
            <li>棚番号は正確に入力してください。誤りがあると商品が見つからなくなります。</li>
            <li>入庫後は在庫管理画面で在庫数を確認してください。</li>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}