import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Add,
  CheckCircle,
  DeleteOutline,
  LocalShipping,
  Print,
  Send,
  Warning,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import api from "../../api/clients";
import type { Product, Shipment, ShipmentStatus, Store } from "./types";

interface ShipmentManagementPageProps {
  staffMode?: boolean;
}

interface DraftItem {
  product_id: number | "";
  quantity: string;
}

const statusColors: Record<
  ShipmentStatus,
  "warning" | "info" | "primary" | "success"
> = {
  requested: "warning",
  confirmed: "info",
  shipped: "primary",
  delivered: "success",
};

const statusTabs = [
  { value: "all", label: "すべて" },
  { value: "requested", label: "出荷指示" },
  { value: "confirmed", label: "出庫確定" },
  { value: "shipped", label: "配送中" },
  { value: "delivered", label: "配送完了" },
] as const;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (error as {
      response?: { data?: { message?: string; errors?: Record<string, string[]> } };
    }).response;
    const validationMessage = response?.data?.errors
      ? Object.values(response.data.errors).flat()[0]
      : undefined;

    return validationMessage || response?.data?.message || fallback;
  }

  return fallback;
};

const formatDateTime = (value: string | null) =>
  value ? new Date(value).toLocaleString("ja-JP") : "-";

export default function ShipmentManagementPage({
  staffMode = false,
}: ShipmentManagementPageProps) {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [storeId, setStoreId] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [items, setItems] = useState<DraftItem[]>([
    { product_id: "", quantity: "" },
  ]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [confirmShipment, setConfirmShipment] = useState<Shipment | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      if (staffMode) {
        const shipmentResponse = await api.get<Shipment[]>("/shipments");
        setShipments(shipmentResponse.data);
        return;
      }

      const [shipmentResponse, storeResponse, productResponse] =
        await Promise.all([
          api.get<Shipment[]>("/shipments"),
          api.get<Store[]>("/stores"),
          api.get<Product[]>("/products"),
        ]);

      setShipments(shipmentResponse.data);
      setStores(storeResponse.data);
      setProducts(
        productResponse.data.filter((product) => product.is_active !== false),
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "出荷情報の取得に失敗しました。"));
    } finally {
      setLoading(false);
    }
  }, [staffMode]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const filteredShipments = useMemo(
    () =>
      statusFilter === "all"
        ? shipments
        : shipments.filter((shipment) => shipment.status === statusFilter),
    [shipments, statusFilter],
  );

  const updateItem = (
    index: number,
    field: keyof DraftItem,
    value: number | string,
  ) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const resetForm = () => {
    setStoreId("");
    setNote("");
    setItems([{ product_id: "", quantity: "" }]);
  };

  const createShipment = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!storeId || items.some((item) => !item.product_id || Number(item.quantity) < 1)) {
      setErrorMessage("店舗・商品・数量をすべて入力してください。");
      return;
    }

    if (new Set(items.map((item) => item.product_id)).size !== items.length) {
      setErrorMessage("同じ商品を複数行に指定することはできません。");
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post<Shipment>("/shipments", {
        store_id: storeId,
        note: note.trim() || null,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: Number(item.quantity),
        })),
      });

      resetForm();
      setSuccessMessage(`${response.data.shipment_number} を登録しました。`);
      await fetchData();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "出荷指示の登録に失敗しました。"));
    } finally {
      setSubmitting(false);
    }
  };

  const runAction = async (
    shipment: Shipment,
    action: "confirm-out" | "dispatch" | "deliver",
    success: string,
  ) => {
    try {
      setProcessingId(shipment.id);
      setErrorMessage("");
      setSuccessMessage("");
      await api.post(`/shipments/${shipment.id}/${action}`);
      setSuccessMessage(`${shipment.shipment_number}: ${success}`);
      await fetchData();
      return true;
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "出荷処理に失敗しました。"));
      return false;
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, textAlign: "left" }}>
      <Box display="flex" alignItems="center" gap={1.5} mb={3}>
        <LocalShipping color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight={600}>
            {staffMode ? "出荷作業" : "店舗配送・出荷管理"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {staffMode
              ? "出荷指示の内容を確認し、在庫の出庫を確定します。"
              : "出荷指示から配送完了までの進捗を管理します。"}
          </Typography>
        </Box>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}

      {!staffMode && (
        <Paper elevation={0} sx={{ border: "1px solid #e0e0e0", p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            新しい出荷指示
          </Typography>
          <Box component="form" onSubmit={createShipment}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>配送先店舗</InputLabel>
              <Select
                value={storeId}
                label="配送先店舗"
                onChange={(event) => setStoreId(Number(event.target.value))}
              >
                {stores.map((store) => (
                  <MenuItem key={store.id} value={store.id}>
                    {store.store_code} / {store.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="subtitle2" mb={1}>
              出荷商品
            </Typography>
            {items.map((item, index) => (
              <Box
                key={index}
                display="grid"
                gap={1.5}
                alignItems="center"
                sx={{
                  gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 1fr) 160px 40px" },
                  mb: 1.5,
                }}
              >
                <FormControl fullWidth>
                  <InputLabel>商品</InputLabel>
                  <Select
                    value={item.product_id}
                    label="商品"
                    onChange={(event) =>
                      updateItem(index, "product_id", Number(event.target.value))
                    }
                  >
                    {products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="指示数量"
                  type="number"
                  value={item.quantity}
                  inputProps={{ min: 1, max: 10000 }}
                  onChange={(event) =>
                    updateItem(index, "quantity", event.target.value)
                  }
                />
                <IconButton
                  aria-label="商品行を削除"
                  disabled={items.length === 1}
                  onClick={() =>
                    setItems((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                >
                  <DeleteOutline />
                </IconButton>
              </Box>
            ))}

            <Button
              startIcon={<Add />}
              onClick={() =>
                setItems((current) => [
                  ...current,
                  { product_id: "", quantity: "" },
                ])
              }
              sx={{ mb: 2 }}
            >
              商品を追加
            </Button>

            <TextField
              fullWidth
              multiline
              rows={2}
              label="備考"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              sx={{ mb: 2 }}
            />
            <Divider sx={{ mb: 2 }} />
            <Button
              type="submit"
              variant="contained"
              startIcon={<Send />}
              disabled={submitting || stores.length === 0}
            >
              {submitting ? "登録中..." : "出荷指示を登録"}
            </Button>
          </Box>
        </Paper>
      )}

      <Paper elevation={0} sx={{ border: "1px solid #e0e0e0" }}>
        <Tabs
          value={statusFilter}
          onChange={(_event, value) => setStatusFilter(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2, borderBottom: "1px solid #e0e0e0" }}
        >
          {statusTabs.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell>出荷番号</TableCell>
                <TableCell>店舗</TableCell>
                <TableCell>指示日時</TableCell>
                <TableCell align="right">数量</TableCell>
                <TableCell>状態</TableCell>
                <TableCell align="right">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredShipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">
                      該当する出荷データはありません
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>
                        {shipment.shipment_number}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {shipment.items
                          .map((item) => item.product_name)
                          .join("、")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {shipment.store.store_code} / {shipment.store.name}
                    </TableCell>
                    <TableCell>{formatDateTime(shipment.requested_at)}</TableCell>
                    <TableCell align="right">
                      {shipment.total_quantity.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={statusColors[shipment.status]}
                        label={shipment.status_label}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        display="flex"
                        gap={1}
                        justifyContent="flex-end"
                        flexWrap="wrap"
                      >
                        {shipment.status === "requested" && (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<CheckCircle />}
                            disabled={processingId === shipment.id}
                            onClick={() => setConfirmShipment(shipment)}
                          >
                            出庫確定
                          </Button>
                        )}
                        {shipment.status !== "requested" && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Print />}
                            onClick={() =>
                              navigate(
                                staffMode
                                  ? `/staff/shipments/${shipment.id}/slip`
                                  : `/shipments/${shipment.id}/slip`,
                              )
                            }
                          >
                            伝票
                          </Button>
                        )}
                        {!staffMode && shipment.status === "confirmed" && (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<LocalShipping />}
                            disabled={processingId === shipment.id}
                            onClick={() =>
                              void runAction(
                                shipment,
                                "dispatch",
                                "店舗配送を開始しました。",
                              )
                            }
                          >
                            配送開始
                          </Button>
                        )}
                        {!staffMode && shipment.status === "shipped" && (
                          <Button
                            size="small"
                            color="success"
                            variant="contained"
                            startIcon={<CheckCircle />}
                            disabled={processingId === shipment.id}
                            onClick={() =>
                              void runAction(
                                shipment,
                                "deliver",
                                "配送完了として記録しました。",
                              )
                            }
                          >
                            配送完了
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={Boolean(confirmShipment)}
        onClose={() => {
          if (processingId === null) {
            setConfirmShipment(null);
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Warning color="warning" />
            出庫確定の確認
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Alert severity="warning" sx={{ mb: 2 }}>
            確定すると在庫が減算され、入出庫履歴に記録されます。
          </Alert>
          <Box display="grid" gap={1.5}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                出荷番号
              </Typography>
              <Typography fontWeight={600}>
                {confirmShipment?.shipment_number}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                配送先店舗
              </Typography>
              <Typography fontWeight={600}>
                {confirmShipment?.store.store_code} /{" "}
                {confirmShipment?.store.name}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                出荷商品
              </Typography>
              {confirmShipment?.items.map((item) => (
                <Box
                  key={item.id}
                  display="flex"
                  justifyContent="space-between"
                  gap={2}
                >
                  <Typography variant="body2">
                    {item.product_name} ({item.sku})
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {item.quantity.toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Divider />
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight={600}>合計数量</Typography>
              <Typography fontWeight={700}>
                {confirmShipment?.total_quantity.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmShipment(null)}
            disabled={processingId !== null}
          >
            キャンセル
          </Button>
          <Button
            variant="contained"
            color="warning"
            disabled={processingId !== null}
            onClick={async () => {
              if (!confirmShipment) {
                return;
              }

              const succeeded = await runAction(
                confirmShipment,
                "confirm-out",
                "出庫を確定しました。",
              );

              if (succeeded) {
                setConfirmShipment(null);
              }
            }}
          >
            {processingId !== null ? "確定中..." : "出庫を確定"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
