import { useEffect, useState } from "react";
import { ArrowBack, Print } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/clients";
import type { Shipment } from "./types";

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleString("ja-JP") : "-";

export default function ShipmentSlipPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    api
      .get<Shipment>(`/shipments/${id}/slip`)
      .then((response) => setShipment(response.data))
      .catch(() => setErrorMessage("出荷伝票を取得できませんでした。"));
  }, [id]);

  if (errorMessage) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{errorMessage}</Alert>
      </Container>
    );
  }

  if (!shipment) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    // <Container maxWidth="md" sx={{ py: 4, textAlign: "left" }}>
    <Container
      maxWidth="md"
      sx={{
        py: 4,
        textAlign: "left",
        "@media print": {
          maxWidth: "100%",
          width: "100%",
          p: 0,
          m: 0,
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        mb={2}
        sx={{ "@media print": { display: "none" } }}
      >
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          戻る
        </Button>
        <Button
          variant="contained"
          startIcon={<Print />}
          onClick={() => window.print()}
        >
          印刷
        </Button>
      </Box>

      {/* <Paper
        elevation={0}
        sx={{
          border: "1px solid #bdbdbd",
          p: { xs: 3, sm: 5 },
          color: "#111",
          bgcolor: "#fff",
        }}
      > */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #bdbdbd",
          p: { xs: 3, sm: 5 },
          color: "#111",
          bgcolor: "#fff",
          "@media print": {
            border: "none",
            p: 2,
            boxShadow: "none",
          },
        }}
      >
        <Typography variant="h4" align="center" fontWeight={700}>
          出荷伝票
        </Typography>
        <Typography align="center" color="text.secondary" mt={0.5}>
          {shipment.shipment_number}
        </Typography>

        {/* <Divider sx={{ my: 3 }} /> */}
        <Divider
          sx={{
            my: 3,
            "@media print": {
              my: 1.5,
            },
          }}
        />

        <Box
          display="grid"
          gap={2}
          sx={{ gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              配送先
            </Typography>
            <Typography variant="h6">
              {shipment.store.name}
            </Typography>
            <Typography variant="body2">
              {shipment.store.store_code}
            </Typography>
            <Typography variant="body2">
              {shipment.store.address || "-"}
            </Typography>
            <Typography variant="body2">
              {shipment.store.phone || "-"}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              出荷指示: {formatDate(shipment.requested_at)}
            </Typography>
            <Typography variant="body2">
              出庫確定: {formatDate(shipment.confirmed_at)}
            </Typography>
            <Typography variant="body2">
              担当者: {shipment.confirmed_by || "-"}
            </Typography>
          </Box>
        </Box>

        {/* <Table sx={{ mt: 3 }}> */}
        <Table
          sx={{
            mt: 3,
            "@media print": {
              mt: 1.5,
              "& .MuiTableCell-root": {
                py: 1,
                fontSize: "12px",
              },
            },
          }}
        >  
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>商品名</TableCell>
              <TableCell align="right">数量</TableCell>
              <TableCell>ロット / 棚</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipment.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.product_name}</TableCell>
                <TableCell align="right">
                  {item.shipped_quantity.toLocaleString()}
                </TableCell>
                <TableCell>
                  {item.allocations.map((allocation, index) => (
                    <Typography variant="body2" key={index}>
                      {allocation.lot_number} / {allocation.location} /{" "}
                      {allocation.quantity}
                    </Typography>
                  ))}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} align="right">
                <Typography fontWeight={700}>合計</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight={700}>
                  {shipment.total_quantity.toLocaleString()}
                </Typography>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>

        {shipment.note && (
          // <Box mt={3}>
          <Box
            mt={3}
            sx={{
              "@media print": {
                mt: 1.5,
              },
            }}
          >
            <Typography variant="caption" color="text.secondary">
              備考
            </Typography>
            <Typography>{shipment.note}</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
