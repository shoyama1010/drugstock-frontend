import { useEffect, useMemo, useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { ArrowUpward, Save, Warning } from "@mui/icons-material";

interface StockLocationItem {
  product_id: number;
  name: string;
  sku: string;
  location_id: number;
  zone: string;
  aisle: string;
  shelf: string;
  total_stock: number;
  updated_at?: string;
}

interface StockOutResponse {
  message: string;
  product_id: number;
  product_name: string;
  location_id: number;
  location_code: string;
  shipped_quantity: number;
  remaining_stock: number;
  status: string;
  alert_message: string | null;
}

export default function StockOut() {
  const [stocks, setStocks] = useState<StockLocationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [selectedLocationId, setSelectedLocationId] = useState<number | "">("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/stocks");
      setStocks(res.data);
    } catch (error) {
      console.error(error);
      setErrorMessage("在庫一覧の取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const productOptions = useMemo(() => {
    const uniqueMap = new Map<number, { product_id: number; name: string; sku: string }>();

    stocks.forEach((item) => {
      if (!uniqueMap.has(item.product_id)) {
        uniqueMap.set(item.product_id, {
          product_id: item.product_id,
          name: item.name,
          sku: item.sku,
        });
      }
    });

    return Array.from(uniqueMap.values());
  }, [stocks]);

  const locationOptions = useMemo(() => {
    if (!selectedProductId) return [];
    return stocks.filter((item) => item.product_id === selectedProductId);
  }, [stocks, selectedProductId]);

  const selectedLocation = useMemo(() => {
    return locationOptions.find((item) => item.location_id === selectedLocationId);
  }, [locationOptions, selectedLocationId]);

  const selectedProduct = useMemo(() => {
    return productOptions.find((item) => item.product_id === selectedProductId);
  }, [productOptions, selectedProductId]);

  const handleProductChange = (productId: number) => {
    setSelectedProductId(productId);
    setSelectedLocationId("");
    setQuantity("");
    setErrorMessage("");
    setSuccessMessage("");
    setAlertMessage("");
  };

  const handleLocationChange = (locationId: number) => {
    setSelectedLocationId(locationId);
    setQuantity("");
    setErrorMessage("");
    setSuccessMessage("");
    setAlertMessage("");
  };

  const resetForm = () => {
    setSelectedProductId("");
    setSelectedLocationId("");
    setQuantity("");
    setReason("");
    setErrorMessage("");
    setSuccessMessage("");
    setAlertMessage("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setAlertMessage("");

    if (!selectedProductId) {
      setErrorMessage("商品を選択してください。");
      return;
    }

    if (!selectedLocationId) {
      setErrorMessage("棚を選択してください。");
      return;
    }

    if (!quantity || parseInt(quantity, 10) <= 0) {
      setErrorMessage("出庫数量は1以上の数値を入力してください。");
      return;
    }

    if (selectedLocation && parseInt(quantity, 10) > selectedLocation.total_stock) {
      setErrorMessage(
        `指定棚の在庫不足です。現在庫: ${selectedLocation.total_stock}個`,
      );
      return;
    }

    if (!reason.trim()) {
      setErrorMessage("出庫理由を入力してください。");
      return;
    }

    setConfirmDialogOpen(true);
  };

  const handleConfirmStockOut = async () => {
    if (!selectedProductId || !selectedLocationId) return;

    try {
      setSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");
      setAlertMessage("");

      const res = await api.post<StockOutResponse>("/stocks/out", {
        product_id: selectedProductId,
        location_id: selectedLocationId,
        quantity: Number(quantity),
        reason,
      });

      setSuccessMessage(
        `${res.data.product_name} を ${res.data.location_code} から ${res.data.shipped_quantity}個 出庫しました。残在庫: ${res.data.remaining_stock}個`
      );

      if (res.data.alert_message) {
        setAlertMessage(res.data.alert_message);
      }

      setConfirmDialogOpen(false);
      resetForm();
      await fetchStocks();
    } catch (error: any) {
      console.error(error);

      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("出庫処理に失敗しました。");
      }

      setConfirmDialogOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelConfirm = () => {
    if (submitting) return;
    setConfirmDialogOpen(false);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <ArrowUpward sx={{ fontSize: 32, color: "#d32f2f", mr: 1.5 }} />
        <Typography variant="h4" fontWeight={600}>
          出庫処理
        </Typography>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}

      {alertMessage && (
        <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setAlertMessage("")}>
          {alertMessage}
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
              {productOptions.map((product) => (
                <MenuItem key={product.product_id} value={product.product_id}>
                  {product.name} ({product.sku})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }} disabled={!selectedProductId}>
            <InputLabel id="location-select-label">棚選択</InputLabel>
            <Select
              labelId="location-select-label"
              value={selectedLocationId}
              label="棚選択"
              onChange={(e) => handleLocationChange(Number(e.target.value))}
            >
              <MenuItem value="">
                <em>選択してください</em>
              </MenuItem>
              {locationOptions.map((location) => (
                <MenuItem key={location.location_id} value={location.location_id}>
                  {location.zone}-{location.aisle}-{location.shelf}（現在庫: {location.total_stock}）
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedProduct && selectedLocation && (
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

              <Box display="flex" gap={3} mt={1} flexWrap="wrap">
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

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    現在庫数
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {selectedLocation.total_stock}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    棚番号
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {selectedLocation.zone}-{selectedLocation.aisle}-{selectedLocation.shelf}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          <TextField
            fullWidth
            label="出庫数量"
            type="number"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              setErrorMessage("");
            }}
            placeholder="出庫する数量を入力"
            InputProps={{
              inputProps: {
                min: 1,
                max: selectedLocation?.total_stock || 10000,
              },
            }}
            sx={{ mb: 3 }}
            helperText={
              selectedLocation
                ? `1〜${selectedLocation.total_stock}の範囲で入力してください`
                : "商品と棚を選択してください"
            }
            disabled={!selectedLocation || selectedLocation.total_stock === 0}
            error={
              !!selectedLocation &&
              !!quantity &&
              parseInt(quantity, 10) > selectedLocation.total_stock
            }
          />

          <TextField
            fullWidth
            label="出庫理由"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="例: 店頭販売、破損、返品など"
            multiline
            rows={3}
            sx={{ mb: 3 }}
            helperText="出庫の理由を記入してください"
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
                bgcolor: "#d32f2f",
                py: 1.5,
                "&:hover": {
                  bgcolor: "#c62828",
                },
              }}
            >
              出庫登録
            </Button>

            <Button variant="outlined" size="large" sx={{ px: 4, py: 1.5 }} onClick={resetForm}>
              クリア
            </Button>
          </Box>
        </form>
      </Paper>

      <Dialog open={confirmDialogOpen} onClose={handleCancelConfirm} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Warning />
            出庫確認
          </Box>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            以下の内容で出庫処理を実行します。よろしいですか？
          </Typography>

          <Paper elevation={0} sx={{ bgcolor: "#f5f5f5", p: 2, mt: 2 }}>
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary">商品名</Typography>
              <Typography variant="body1" fontWeight={600}>{selectedProduct?.name}</Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="caption" color="text.secondary">SKU</Typography>
              <Typography variant="body1" fontWeight={600} sx={{ fontFamily: "monospace" }}>
                {selectedProduct?.sku}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="caption" color="text.secondary">棚番号</Typography>
              <Typography variant="body1" fontWeight={600}>
                {selectedLocation?.zone}-{selectedLocation?.aisle}-{selectedLocation?.shelf}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="caption" color="text.secondary">出庫数量</Typography>
              <Typography variant="h6" fontWeight={600} color="#d32f2f">
                {quantity}個
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="caption" color="text.secondary">現在庫数</Typography>
              <Typography variant="body1" fontWeight={600}>
                {selectedLocation?.total_stock}個
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="caption" color="text.secondary">出庫後の在庫数</Typography>
              <Typography variant="body1" fontWeight={600} color="#2e7d32">
                {selectedLocation ? selectedLocation.total_stock - parseInt(quantity || "0", 10) : 0}個
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">出庫理由</Typography>
              <Typography variant="body1">{reason}</Typography>
            </Box>
          </Paper>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCancelConfirm} variant="outlined" sx={{ px: 3 }} disabled={submitting}>
            キャンセル
          </Button>
          <Button
            onClick={handleConfirmStockOut}
            variant="contained"
            disabled={submitting}
            sx={{
              bgcolor: "#d32f2f",
              px: 3,
              "&:hover": {
                bgcolor: "#c62828",
              },
            }}
          >
            {submitting ? "出庫中..." : "出庫を実行"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}