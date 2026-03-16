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
} from "@mui/material";
import { ArrowDownward, Save } from "@mui/icons-material";

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
    name: "目薬サンテFX",
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

export default function StockIn() {
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [quantity, setQuantity] = useState("");
  const [shelfNumber, setShelfNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const selectedProduct = mockProducts.find((p) => p.id === selectedProductId);

  const handleProductChange = (productId: number) => {
    setSelectedProductId(productId);
    const product = mockProducts.find((p) => p.id === productId);
    if (product) {
      setShelfNumber(product.shelfNumber);
    }
    setErrorMessage("");
    setSuccessMessage("");
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

    if (!quantity || parseInt(quantity) <= 0) {
      setErrorMessage("入庫数量は1以上の数値を入力してください。");
      return;
    }

    if (parseInt(quantity) > 10000) {
      setErrorMessage("入庫数量は10,000以下で入力してください。");
      return;
    }

    if (!shelfNumber.trim()) {
      setErrorMessage("棚番号を入力してください。");
      return;
    }

    // 成功処理（実際にはAPIコール）
    const product = mockProducts.find((p) => p.id === selectedProductId);
    setSuccessMessage(
      `${product?.name}（SKU: ${product?.sku}）を${quantity}個入庫しました。棚番号: ${shelfNumber}`,
    );

    // フォームをリセット
    setSelectedProductId("");
    setQuantity("");
    setShelfNumber("");
  };

  return (
      <Container maxWidth='md' sx={{ py: 4 }}>
        {/* ページヘッダー */}
        <Box display='flex' alignItems='center' mb={4}>
          <ArrowDownward
            sx={{
              fontSize: 32,
              color: "#2e7d32",
              mr: 1.5,
            }}
          />
          <Typography variant='h4' fontWeight={600}>
            入庫処理
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
                  <MenuItem key={product.id} value={product.id}>
                    {product.name} ({product.sku}) - 現在庫:{" "}
                    {product.currentStock}
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
                    <Typography variant='body2' fontWeight={600}>
                      {selectedProduct.currentStock.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* 入庫数量 */}
            <TextField
              fullWidth
              label='入庫数量'
              type='number'
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder='入庫する数量を入力'
              InputProps={{
                inputProps: { min: 1, max: 10000 },
              }}
              sx={{ mb: 3 }}
              helperText='1〜10,000の範囲で入力してください'
            />

            {/* 棚番号 */}
            <TextField
              fullWidth
              label='棚番号'
              value={shelfNumber}
              onChange={(e) => setShelfNumber(e.target.value)}
              placeholder='例: A-12'
              sx={{ mb: 3 }}
              helperText='商品を保管する棚の番号を入力してください'
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
                variant='outlined'
                size='large'
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
              <li>入庫数量は必ず実際の数量を確認してから入力してください。</li>
              <li>
                棚番号は正確に入力してください。誤りがあると商品が見つからなくなります。
              </li>
              <li>入庫後は在庫管理画面で在庫数を確認してください。</li>
            </Typography>
          </Box>
        </Paper>
      </Container>
  );
}
