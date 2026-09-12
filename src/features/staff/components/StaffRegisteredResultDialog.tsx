import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import { ContentCopy } from "@mui/icons-material";

export interface RegisteredStaffInfo {
  name: string;
  employeeCode: string;
  temporaryPin: string;
}

interface StaffRegisteredResultDialogProps {
  staffInfo: RegisteredStaffInfo | null;
  successMessage: string;
  copyMessage: string;

  onCopy: (
    value: string,
    label: "社員番号" | "仮PIN",
  ) => void;

  onClose: () => void;
}

export default function StaffRegisteredResultDialog({
  staffInfo,
  successMessage,
  copyMessage,
  onCopy,
  onClose,
}: StaffRegisteredResultDialogProps) {
  return (
    <Dialog
      open={staffInfo !== null}
      onClose={(_, reason) => {
        if (
          reason === "backdropClick" ||
          reason === "escapeKeyDown"
        ) {
          return;
        }
      }}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        スタッフ登録完了
      </DialogTitle>

      <DialogContent dividers>
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage ||
            "スタッフを登録しました。"}
        </Alert>

        <Typography sx={{ mb: 2 }}>
          以下の情報をスタッフ本人へお伝えください。
        </Typography>

        <Box
          sx={{
            bgcolor: "#f5f7fa",
            border: "1px solid #d7dce1",
            borderRadius: 2,
            p: 3,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            氏名
          </Typography>

          <Typography
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            {staffInfo?.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            社員番号
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ letterSpacing: 1 }}
            >
              {staffInfo?.employeeCode}
            </Typography>

            <Button
              size="small"
              variant="outlined"
              startIcon={<ContentCopy />}
              onClick={() =>
                onCopy(
                  staffInfo?.employeeCode ?? "",
                  "社員番号",
                )
              }
            >
              コピー
            </Button>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            仮PIN
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              color="error"
              sx={{ letterSpacing: 3 }}
            >
              {staffInfo?.temporaryPin}
            </Typography>

            <Button
              size="small"
              variant="outlined"
              startIcon={<ContentCopy />}
              onClick={() =>
                onCopy(
                  staffInfo?.temporaryPin ?? "",
                  "仮PIN",
                )
              }
            >
              コピー
            </Button>
          </Box>
        </Box>

        {copyMessage && (
          <Alert
            severity={
              copyMessage.includes("失敗")
                ? "error"
                : "info"
            }
            sx={{ mt: 2 }}
          >
            {copyMessage}
          </Alert>
        )}

        <Alert severity="warning" sx={{ mt: 3 }}>
          この画面を閉じると仮PINは再表示できません。
          社員番号と仮PINを必ず控えてから閉じてください。
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          onClick={onClose}
        >
          確認して閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
}