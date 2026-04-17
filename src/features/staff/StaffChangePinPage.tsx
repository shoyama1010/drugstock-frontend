import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

type ChangePinRequest = {
  current_pin: string;
  new_pin: string;
  new_pin_confirmation: string;
};

type ChangePinSuccessResponse = {
  message: string;
};

type ValidationErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export default function StaffChangePinPage() {
  const navigate = useNavigate();

  const [currentPin, setCurrentPin] = useState<string>("");
  const [newPin, setNewPin] = useState<string>("");
  const [newPinConfirmation, setNewPinConfirmation] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const normalizePin = (value: string): string => {
    return value.replace(/\D/g, "").slice(0, 4);
  };

  const getFirstValidationError = (
    errors?: Record<string, string[]>
  ): string | null => {
    if (!errors) return null;

    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return null;

    const firstMessages = errors[firstKey];
    if (!Array.isArray(firstMessages) || firstMessages.length === 0) {
      return null;
    }

    return firstMessages[0];
  };

  const handleChangePin = async (): Promise<void> => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!currentPin || !newPin || !newPinConfirmation) {
      setErrorMessage("すべての項目を入力してください。");
      return;
    }

    if (
      currentPin.length !== 4 ||
      newPin.length !== 4 ||
      newPinConfirmation.length !== 4
    ) {
      setErrorMessage("PINはすべて4桁で入力してください。");
      return;
    }

    if (newPin !== newPinConfirmation) {
      setErrorMessage("新しいPINと確認用PINが一致しません。");
      return;
    }

    if (currentPin === newPin) {
      setErrorMessage("現在のPINとは異なるPINを設定してください。");
      return;
    }

    const payload: ChangePinRequest = {
      current_pin: currentPin,
      new_pin: newPin,
      new_pin_confirmation: newPinConfirmation,
    };

    try {
      setLoading(true);

      const res = await api.post<ChangePinSuccessResponse>(
        "/staffs/change-pin",
        payload
      );

      setSuccessMessage(res.data.message || "PINを変更しました。");

      window.setTimeout(() => {
        navigate("/staff-dashboard");
      }, 1000);
    } catch (error: unknown) {
      console.error("PIN変更エラー:", error);

      if (axios.isAxiosError<ValidationErrorResponse>(error)) {
        const status = error.response?.status;
        const responseData = error.response?.data;

        if (status === 422) {
          const firstValidationError = getFirstValidationError(
            responseData?.errors
          );

          if (firstValidationError) {
            setErrorMessage(firstValidationError);
            return;
          }

          setErrorMessage(responseData?.message || "入力内容に誤りがあります。");
          return;
        }

        if (status === 403) {
          setErrorMessage(responseData?.message || "権限がありません。");
          return;
        }

        if (status === 401) {
          setErrorMessage(
            responseData?.message || "認証が無効です。再度ログインしてください。"
          );
          return;
        }

        setErrorMessage(
          responseData?.message || "PIN変更に失敗しました。"
        );
        return;
      }

      setErrorMessage("予期しないエラーが発生しました。");
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
            onChange={(e) => setCurrentPin(normalizePin(e.target.value))}
            inputProps={{
              maxLength: 4,
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            type="password"
            fullWidth
          />

          <TextField
            label="新しいPIN"
            value={newPin}
            onChange={(e) => setNewPin(normalizePin(e.target.value))}
            inputProps={{
              maxLength: 4,
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            type="password"
            fullWidth
          />

          <TextField
            label="新しいPIN（確認）"
            value={newPinConfirmation}
            onChange={(e) => setNewPinConfirmation(normalizePin(e.target.value))}
            inputProps={{
              maxLength: 4,
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
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

