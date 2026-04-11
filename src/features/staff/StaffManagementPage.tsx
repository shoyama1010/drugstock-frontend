import { useEffect, useState } from "react";
import api from "../../api/clients";
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Toolbar,
  CircularProgress,
} from "@mui/material";
import {
  Add,
  Person,
  Email,
  Visibility,
  Edit,
  Delete,
} from "@mui/icons-material";

interface Staff {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface StaffApiResponse {
  id: number | string;
  employee_code: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const mapStaff = (staff: StaffApiResponse): Staff => {
    return {
      id: String(staff.id),
      employeeId: staff.employee_code,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      isActive: Boolean(staff.is_active),
      createdAt: staff.created_at?.slice(0, 10) ?? "",
      updatedAt: staff.updated_at,
    };
  };

  const fetchStaffList = async () => {
    try {
      setLoading(true);
      const res = await api.get("/staffs");
      const mapped = (res.data as StaffApiResponse[]).map(mapStaff);
      setStaffList(mapped);
    } catch (error: any) {
      console.error("スタッフ一覧取得エラー", error);
      setErrorMessage(
        error.response?.data?.message || "スタッフ一覧の取得に失敗しました。"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setSuccessMessage("");
    setErrorMessage("");
    setNewStaff({ name: "", email: "" });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewStaff({ name: "", email: "" });
    setErrorMessage("");
  };

  const handleViewDetail = (staff: Staff) => {
    setSelectedStaff(staff);
    setOpenDetailDialog(true);
  };

  const handleRegisterStaff = async () => {
    console.log("handleRegisterStaff 実行");

    try {
      setErrorMessage("");

      console.log("送信データ", {
        name: newStaff.name,
        email: newStaff.email,
      });

      const res = await api.post("/staffs", {
        name: newStaff.name,
        email: newStaff.email,
      });

      console.log("登録成功", res.data);

      setSuccessMessage(
        `登録成功！
      社員番号: ${res.data.data.employee_code}
      仮PIN: ${res.data.data.temporary_pin}`
      );

      await fetchStaffList();

      setNewStaff({ name: "", email: "" });

      setTimeout(() => {
        setOpenDialog(false);
        setSuccessMessage("");
      }, 1200);
    } catch (error: any) {
      console.error("スタッフ登録エラー", error);
      console.error("response", error.response);
      console.error("data", error.response?.data);

      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const firstKey = Object.keys(errors)[0];
        setErrorMessage(errors[firstKey][0]);
        return;
      }

      setErrorMessage(
        error.response?.data?.message || "スタッフ登録に失敗しました。"
      );
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!window.confirm("このスタッフを削除してもよろしいですか？")) {
      return;
    }

    try {
      setSuccessMessage("");
      setErrorMessage("");

      await api.delete(`/staffs/${id}`);
      await fetchStaffList();
    } catch (error: any) {
      console.error("スタッフ削除エラー", error);
      setErrorMessage(
        error.response?.data?.message || "スタッフ削除に失敗しました。"
      );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          スタッフ管理
        </Typography>
        <Typography variant="body2" color="text.secondary">
          スタッフの登録・管理を行います
        </Typography>
      </Box>

      {errorMessage && !openDialog && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flex: 1 }}>
            スタッフ一覧（{staffList.length}名）
          </Typography>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenDialog}
            sx={{
              bgcolor: "#1976d2",
              "&:hover": {
                bgcolor: "#1565c0",
              },
            }}
          >
            新規スタッフ登録
          </Button>
        </Toolbar>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell>社員番号</TableCell>
              <TableCell>氏名</TableCell>
              <TableCell>メールアドレス</TableCell>
              <TableCell>役割</TableCell>
              <TableCell>ステータス</TableCell>
              <TableCell>登録日</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box sx={{ py: 4 }}>
                    <CircularProgress size={28} />
                  </Box>
                </TableCell>
              </TableRow>
            ) : staffList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  スタッフが登録されていません。
                </TableCell>
              </TableRow>
            ) : (
              staffList.map((staff) => (
                <TableRow key={staff.id} hover>
                  <TableCell>
                    <strong>{staff.employeeId}</strong>
                  </TableCell>
                  <TableCell>{staff.name}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={staff.role === "staff" ? "スタッフ" : "管理者"}
                      size="small"
                      color={staff.role === "staff" ? "default" : "primary"}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={staff.isActive ? "有効" : "無効"}
                      size="small"
                      color={staff.isActive ? "success" : "default"}
                    />
                  </TableCell>
                  <TableCell>{staff.createdAt}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleViewDetail(staff)}
                      title="詳細表示"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" color="default" title="編集">
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteStaff(staff.id)}
                      title="削除"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Person sx={{ mr: 1, color: "#1976d2" }} />
            新規スタッフ登録
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              スタッフ情報を入力してください。社員番号と仮PINは自動生成されます。
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

            <TextField
              fullWidth
              label="氏名"
              value={newStaff.name}
              onChange={(e) =>
                setNewStaff({ ...newStaff, name: e.target.value })
              }
              placeholder="例: 山田太郎"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="メールアドレス"
              type="email"
              value={newStaff.email}
              onChange={(e) =>
                setNewStaff({ ...newStaff, email: e.target.value })
              }
              placeholder="例: yamada@example.com"
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
              <Typography variant="body2" fontWeight={600} gutterBottom>
                📋 自動生成される情報
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ・社員番号: 自動採番（EMP001, EMP002...）
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ・仮PIN: ランダム4桁数字
              </Typography>
              <Typography variant="body2" color="text.secondary">
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
              <Typography variant="body2" fontWeight={600} gutterBottom>
                📧 メール送信内容
              </Typography>
              <Typography variant="body2" color="text.secondary">
                登録完了後、以下の情報がメールで送信されます：
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ・社員番号
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ・仮PIN
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ・初回ログインURL
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>キャンセル</Button>
          <Button
            variant="contained"
            onClick={handleRegisterStaff}
            disabled={!newStaff.name || !newStaff.email}
            sx={{
              bgcolor: "#1976d2",
              "&:hover": {
                bgcolor: "#1565c0",
              },
            }}
          >
            登録してメール送信
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>スタッフ詳細</DialogTitle>
        <DialogContent>
          {selectedStaff && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  社員番号
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {selectedStaff.employeeId}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  氏名
                </Typography>
                <Typography variant="body1">{selectedStaff.name}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  メールアドレス
                </Typography>
                <Typography variant="body1">{selectedStaff.email}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  役割
                </Typography>
                <Chip
                  label={selectedStaff.role === "staff" ? "スタッフ" : "管理者"}
                  color={selectedStaff.role === "staff" ? "default" : "primary"}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  ステータス
                </Typography>
                <Chip
                  label={selectedStaff.isActive ? "有効" : "無効"}
                  color={selectedStaff.isActive ? "success" : "default"}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  登録日
                </Typography>
                <Typography variant="body1">
                  {selectedStaff.createdAt}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}