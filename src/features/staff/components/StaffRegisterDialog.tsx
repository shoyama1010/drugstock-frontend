import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

import { Person } from "@mui/icons-material";

interface StaffForm {
  name: string;
  email: string;
}

interface StaffRegisterDialogProps {
  open: boolean;
  registering: boolean;
  newStaff: StaffForm;
  errorMessage: string;

  onClose: () => void;
  onRegister: () => void;

  onChangeName: (value: string) => void;
  onChangeEmail: (value: string) => void;
}

export default function StaffRegisterDialog({
  open,
  registering,
  newStaff,
  errorMessage,
  onClose,
  onRegister,
  onChangeName,
  onChangeEmail,
}: StaffRegisterDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Person
            sx={{
              mr: 1,
              color: "#1976d2",
            }}
          />

          新規スタッフ登録
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            スタッフ情報を入力してください。
            社員番号と仮PINは自動生成されます。
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <TextField
            fullWidth
            required
            label="氏名"
            value={newStaff.name}
            onChange={(event) =>
              onChangeName(event.target.value)
            }
            placeholder="例: 山田太郎"
            disabled={registering}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            required
            label="メールアドレス"
            type="email"
            value={newStaff.email}
            onChange={(event) =>
              onChangeEmail(event.target.value)
            }
            placeholder="例: yamada@example.com"
            disabled={registering}
            sx={{ mb: 2 }}
          />

          <Box
            sx={{
              bgcolor: "#e3f2fd",
              p: 2,
              borderRadius: 1,
              border: "1px solid #90caf9",
            }}
          >
            <Typography
              variant="body2"
              fontWeight={600}
              gutterBottom
            >
              📋 自動生成される情報
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              ・社員番号: 自動採番（EMP001、EMP002...）
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              ・仮PIN: ランダム4桁数字
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              ・役割: スタッフ
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: "#fff3e0",
              p: 2,
              borderRadius: 1,
              border: "1px solid #ffb74d",
              mt: 2,
            }}
          >
            <Typography
              variant="body2"
              fontWeight={600}
              gutterBottom
            >
              📧 登録後の通知
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              登録完了後、社員番号と仮PINを画面に表示します。
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              本番環境では、表示された情報をスタッフ本人へ
              お伝えください。
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={registering}
        >
          キャンセル
        </Button>

        <Button
          variant="contained"
          onClick={onRegister}
          disabled={
            registering ||
            !newStaff.name.trim() ||
            !newStaff.email.trim()
          }
          startIcon={
            registering ? (
              <CircularProgress
                size={18}
                color="inherit"
              />
            ) : undefined
          }
          sx={{
            bgcolor: "#1976d2",
            "&:hover": {
              bgcolor: "#1565c0",
            },
          }}
        >
          {registering
            ? "登録中..."
            : "スタッフを登録"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}