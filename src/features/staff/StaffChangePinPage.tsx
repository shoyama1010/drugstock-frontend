import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/clients";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
} from "@mui/material";

export default function StaffChangePinPage() {
  const navigate = useNavigate();

  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newPinConfirmation, setNewPinConfirmation] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePin = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!currentPin || !newPin || !newPinConfirmation) {
      setErrorMessage("すべての項目を入力してください。");
      return;
    }

    if (currentPin.length !== 4 || newPin.length !== 4 || newPinConfirmation.length !== 4) {
      setErrorMessage("PINはすべて4桁で入力してください。");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/staffs/change-pin", {
        current_pin: currentPin,
        new_pin: newPin,
        new_pin_confirmation: newPinConfirmation,
      });
      setSuccessMessage(res.data.message || "PINを変更しました。");

      setTimeout(() => {
        navigate("/staff-dashboard");
      }, 1000);
    } catch (error: any) {
      console.error("PIN変更エラー", error);
      console.error("response", error.response);
      console.error("data", error.response?.data);

      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors) {
          const firstKey = Object.keys(errors)[0];
          setErrorMessage(errors[firstKey][0]);
          return;
        }

        setErrorMessage(error.response.data.message || "PIN変更に失敗しました。");
        return;
      }

      if (error.response?.status === 403) {
        setErrorMessage(error.response.data.message || "権限がありません。");
        return;
      }

      setErrorMessage(error.response?.data?.message || "PIN変更に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          初回PIN変更
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          初回ログインのため、仮PINを新しいPINへ変更してください。
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="現在のPIN"
            value={currentPin}
            onChange={(e) => setCurrentPin(e.target.value)}
            inputProps={{ maxLength: 4 }}
            type="password"
            fullWidth
          />

          <TextField
            label="新しいPIN"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            inputProps={{ maxLength: 4 }}
            type="password"
            fullWidth
          />

          <TextField
            label="新しいPIN（確認）"
            value={newPinConfirmation}
            onChange={(e) => setNewPinConfirmation(e.target.value)}
            inputProps={{ maxLength: 4 }}
            type="password"
            fullWidth
          />

          <Button
            variant="contained"
            onClick={handleChangePin}
            disabled={loading}
            sx={{ mt: 2, py: 1.5 }}
          >
            {loading ? "変更中..." : "PINを変更する"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}