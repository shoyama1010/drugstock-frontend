import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import type { Staff } from "./StaffTable";

interface StaffDetailDialogProps {
  open: boolean;
  staff: Staff | null;
  onClose: () => void;
}

export default function StaffDetailDialog({
  open,
  staff,
  onClose,
}: StaffDetailDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        スタッフ詳細
      </DialogTitle>

      <DialogContent>
        {staff && (
          <Box sx={{ pt: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                社員番号
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
              >
                {staff.employeeId}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                氏名
              </Typography>

              <Typography variant="body1">
                {staff.name}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                メールアドレス
              </Typography>

              <Typography variant="body1">
                {staff.email}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                役割
              </Typography>

              <Chip
                label={
                  staff.role === "staff"
                    ? "スタッフ"
                    : "管理者"
                }
                color={
                  staff.role === "staff"
                    ? "default"
                    : "primary"
                }
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                ステータス
              </Typography>

              <Chip
                label={
                  staff.isActive
                    ? "有効"
                    : "無効"
                }
                color={
                  staff.isActive
                    ? "success"
                    : "default"
                }
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                登録日
              </Typography>

              <Typography variant="body1">
                {staff.createdAt}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
}