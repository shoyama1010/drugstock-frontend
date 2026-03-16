import { useState } from "react";
// import { SidebarLayout } from "../../components/layout/SidebarLayout";
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
} from "@mui/material";
import { ArrowUpward, Save, Warning } from "@mui/icons-material";

interface Product {
  id: number;
  name: string;
  sku: string;
  currentStock: number;
  shelfNumber: string;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "ロキソニンS",
    sku: "MED-001",
    currentStock: 245,
    shelfNumber: "A-12",
  },
  {
    id: 2,
    name: "パブロンゴールドA",
    sku: "MED-002",
    currentStock: 15,
    shelfNumber: "A-13",
  },
  {
    id: 3,
    name: "ムヒS",
    sku: "MED-003",
    currentStock: 0,
    shelfNumber: "B-05",
  },
  {
    id: 4,
    name: "DHC ビタミンC",
    sku: "SUP-001",
    currentStock: 156,
    shelfNumber: "C-08",
  },
  {
    id: 5,
    name: "花王 アタックZERO",
    sku: "DLY-001",
    currentStock: 8,
    shelfNumber: "D-15",
  },
  {
    id: 6,
    name: "ライオン クリニカ",
    sku: "DLY-002",
    currentStock: 412,
    shelfNumber: "D-16",
  },
  {
    id: 7,
    name: "バファリンA",
    sku: "MED-004",
    currentStock: 198,
    shelfNumber: "A-14",
  },
  {
    id: 8,
    name: "目薬サ��テFX",
    sku: "MED-005",
    currentStock: 0,
    shelfNumber: "B-03",
  },
  {
    id: 9,
    name: "マスク 50枚入",
    sku: "DLY-003",
    currentStock: 534,
    shelfNumber: "E-01",
  },
  {
    id: 10,
    name: "ポカリスエット",
    sku: "BEV-001",
    currentStock: 145,
    shelfNumber: "F-10",
  },
];

export default function StockOut() {
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const selectedProduct = mockProducts.find((p) => p.id === selectedProductId);

  const handleProductChange = (productId: number) => {
    setSelectedProductId(productId);
    setErrorMessage("");
    setSuccessMessage("");
    setQuantity("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // バリデーション
    if (!selectedProductId) {
      setErrorMessage("商品を選択してください。");
      return;
    }

    const product = mockProducts.find((p) => p.id === selectedProductId);

    if (!quantity || parseInt(quantity) <= 0) {
      setErrorMessage("出庫数量は1以上の数値を入力してください。");
      return;
    }

    if (product && parseInt(quantity) > product.currentStock) {
      setErrorMessage(
        `在庫不足：出庫数量が在庫数を超えています。現在庫: ${product.currentStock}個`,
      );
      return;
    }

    if (!reason.trim()) {
      setErrorMessage("出庫理由を入力してください。");
      return;
    }

    // 確認ダイアログを表示
    setConfirmDialogOpen(true);
  };

  const handleConfirmStockOut = () => {
    const product = mockProducts.find((p) => p.id === selectedProductId);

    // 成功処理（実際にはAPIコール）
    setSuccessMessage(
      `${product?.name}（SKU: ${product?.sku}）を${quantity}個出庫しました。`,
    );

    // フォームをリセット
    setSelectedProductId("");
    setQuantity("");
    setReason("");
    setConfirmDialogOpen(false);
  };

  const handleCancelConfirm = () => {
    setConfirmDialogOpen(false);
  };

  return (
      <Container maxWidth='md' sx={{ py: 4 }}>
        {/* ページヘッダー */}
        <Box display='flex' alignItems='center' mb={4}>
          <ArrowUpward
            sx={{
              fontSize: 32,
              color: "#d32f2f",
              mr: 1.5,
            }}
          />
          <Typography variant='h4' fontWeight={600}>
            出庫処理
          </Typography>
        </Box>

        {/* メッセージ表示エリア */}
        {errorMessage && (
          <Alert
            severity='error'
            sx={{ mb: 3 }}
            onClose={() => setErrorMessage("")}
          >
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert
            severity='success'
            sx={{ mb: 3 }}
            onClose={() => setSuccessMessage("")}
          >
            {successMessage}
          </Alert>
        )}

        {/* フォーム */}
        <Paper elevation={0} sx={{ border: "1px solid #e0e0e0", p: 4 }}>
          <form onSubmit={handleSubmit}>
            {/* 商品選択 */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id='product-select-label'>商品選択</InputLabel>
              <Select
                labelId='product-select-label'
                value={selectedProductId}
                label='商品選択'
                onChange={(e) => handleProductChange(e.target.value as number)}
              >
                <MenuItem value=''>
                  <em>選択してください</em>
                </MenuItem>
                {mockProducts.map((product) => (
                  <MenuItem
                    key={product.id}
                    value={product.id}
                    disabled={product.currentStock === 0}
                  >
                    {product.name} ({product.sku}) - 現在庫:{" "}
                    {product.currentStock}
                    {product.currentStock === 0 && " (在庫なし)"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* 選択商品情報表示 */}
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
                <Typography variant='body2' color='text.secondary' gutterBottom>
                  選択中の商品情報
                </Typography>
                <Box display='flex' gap={3} mt={1}>
                  <Box>
                    <Typography variant='caption' color='text.secondary'>
                      商品名
                    </Typography>
                    <Typography variant='body2' fontWeight={600}>
                      {selectedProduct.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant='caption' color='text.secondary'>
                      SKU
                    </Typography>
                    <Typography
                      variant='body2'
                      fontWeight={600}
                      sx={{ fontFamily: "monospace" }}
                    >
                      {selectedProduct.sku}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant='caption' color='text.secondary'>
                      現在庫数
                    </Typography>
                    <Typography
                      variant='body2'
                      fontWeight={600}
                      color={
                        selectedProduct.currentStock < 50
                          ? "#ed6c02"
                          : "inherit"
                      }
                    >
                      {selectedProduct.currentStock.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant='caption' color='text.secondary'>
                      棚番号
                    </Typography>
                    <Typography variant='body2' fontWeight={600}>
                      {selectedProduct.shelfNumber}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* 出庫数量 */}
            <TextField
              fullWidth
              label='出庫数量'
              type='number'
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setErrorMessage("");
              }}
              placeholder='出庫する数量を入力'
              InputProps={{
                inputProps: {
                  min: 1,
                  max: selectedProduct?.currentStock || 10000,
                },
              }}
              sx={{ mb: 3 }}
              helperText={
                selectedProduct
                  ? `1〜${selectedProduct.currentStock}の範囲で入力してください`
                  : "商品を選択してください"
              }
              disabled={!selectedProduct || selectedProduct.currentStock === 0}
              error={
                selectedProduct &&
                quantity &&
                parseInt(quantity) > selectedProduct.currentStock
              }
            />

            {/* 在庫不足警告 */}
            {selectedProduct &&
              quantity &&
              parseInt(quantity) > selectedProduct.currentStock && (
                <Alert severity='error' sx={{ mb: 3 }}>
                  <Box display='flex' alignItems='center' gap={1}>
                    <Warning />
                    <Typography variant='body2' fontWeight={600}>
                      在庫不足：出庫数量が在庫数を超えています。
                    </Typography>
                  </Box>
                  <Typography variant='body2' sx={{ mt: 1 }}>
                    現在庫数: <strong>{selectedProduct.currentStock}個</strong>{" "}
                    / 入力数量: <strong>{quantity}個</strong>
                  </Typography>
                </Alert>
              )}

            {/* 出庫理由 */}
            <TextField
              fullWidth
              label='出庫理由'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder='例: 店頭販売、破損、返品など'
              multiline
              rows={3}
              sx={{ mb: 3 }}
              helperText='出庫の理由を記入してください'
            />

            <Divider sx={{ my: 3 }} />

            {/* 送信ボタン */}
            <Box display='flex' gap={2}>
              <Button
                type='submit'
                variant='contained'
                size='large'
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
              <Button
                variant='outlined'
                size='large'
                sx={{
                  px: 4,
                  py: 1.5,
                }}
                onClick={() => {
                  setSelectedProductId("");
                  setQuantity("");
                  setReason("");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
              >
                クリア
              </Button>
            </Box>
          </form>

          {/* 注意事項 */}
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <Typography variant='body2' color='text.secondary' gutterBottom>
              <strong>注意事項：</strong>
            </Typography>
            <Typography
              variant='body2'
              color='text.secondary'
              component='ul'
              sx={{ pl: 2 }}
            >
              <li>出��数量は現在の在庫数を超えて入力できません。</li>
              <li>出庫理由は後から確認できるように詳細に記入してください。</li>
              <li>
                出庫後は在庫管理画面で在庫数が正しく更新されているか確認してください。
              </li>
            </Typography>
          </Box>
        </Paper>

        {/* 確認ダイアログ */}
        <Dialog
          open={confirmDialogOpen}
          onClose={handleCancelConfirm}
          maxWidth='sm'
          fullWidth
        >
          <DialogTitle
            sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600 }}
          >
            <Box display='flex' alignItems='center' gap={1}>
              <Warning />
              出庫確認
            </Box>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Typography variant='body1' gutterBottom>
              以下の内容で出庫処理を実行します。よろしいですか？
            </Typography>

            <Paper elevation={0} sx={{ bgcolor: "#f5f5f5", p: 2, mt: 2 }}>
              <Box mb={2}>
                <Typography variant='caption' color='text.secondary'>
                  商品名
                </Typography>
                <Typography variant='body1' fontWeight={600}>
                  {selectedProduct?.name}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant='caption' color='text.secondary'>
                  SKU
                </Typography>
                <Typography
                  variant='body1'
                  fontWeight={600}
                  sx={{ fontFamily: "monospace" }}
                >
                  {selectedProduct?.sku}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant='caption' color='text.secondary'>
                  出庫数量
                </Typography>
                <Typography variant='h6' fontWeight={600} color='#d32f2f'>
                  {quantity}個
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant='caption' color='text.secondary'>
                  現在庫数
                </Typography>
                <Typography variant='body1' fontWeight={600}>
                  {selectedProduct?.currentStock}個
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant='caption' color='text.secondary'>
                  出庫後の在庫数
                </Typography>
                <Typography variant='body1' fontWeight={600} color='#2e7d32'>
                  {selectedProduct
                    ? selectedProduct.currentStock - parseInt(quantity || "0")
                    : 0}
                  個
                </Typography>
              </Box>

              <Box>
                <Typography variant='caption' color='text.secondary'>
                  出庫理由
                </Typography>
                <Typography variant='body1'>{reason}</Typography>
              </Box>
            </Paper>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={handleCancelConfirm}
              variant='outlined'
              sx={{ px: 3 }}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleConfirmStockOut}
              variant='contained'
              sx={{
                bgcolor: "#d32f2f",
                px: 3,
                "&:hover": {
                  bgcolor: "#c62828",
                },
              }}
              autoFocus
            >
              出庫を実行
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
  );
}
