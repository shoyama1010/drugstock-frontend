import { useState } from "react";
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
} from "@mui/material";
import {
  Add,
  Person,
  Email,
  Visibility,
  Edit,
  Delete,
  AccountTree,
} from "@mui/icons-material";
// import { SidebarLayout } from "../../components/layout/SidebarLayout";
import { useNavigate } from "react-router-dom";

interface Staff {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: string;
  temporaryPin: string;
  isActive: boolean;
  createdAt: string;
}

export default function StaffManagement() {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState<Staff[]>([
    {
      id: "1",
      employeeId: "EMP001",
      name: "山田太郎",
      email: "yamada@example.com",
      role: "staff",
      temporaryPin: "1234",
      isActive: true,
      createdAt: "2026-02-20",
    },
    {
      id: "2",
      employeeId: "EMP002",
      name: "佐藤花子",
      email: "sato@example.com",
      role: "staff",
      temporaryPin: "5678",
      isActive: true,
      createdAt: "2026-02-22",
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  // 社員番号の自動採番
  const generateEmployeeId = () => {
    const maxId = staffList.reduce((max, staff) => {
      const num = parseInt(staff.employeeId.replace("EMP", ""));
      return num > max ? num : max;
    }, 0);
    return `EMP${String(maxId + 1).padStart(3, "0")}`;
  };

  // 仮PINの自動生成（ランダム4桁）
  const generateTemporaryPin = () => {
    return String(Math.floor(1000 + Math.random() * 9000));
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setSuccessMessage("");
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewStaff({ name: "", email: "" });
  };

  const handleViewDetail = (staff: Staff) => {
    setSelectedStaff(staff);
    setOpenDetailDialog(true);
  };

  const handleRegisterStaff = () => {
    if (!newStaff.name || !newStaff.email) {
      return;
    }

    const employeeId = generateEmployeeId();
    const temporaryPin = generateTemporaryPin();

    const staff: Staff = {
      id: String(staffList.length + 1),
      employeeId,
      name: newStaff.name,
      email: newStaff.email,
      role: "staff",
      temporaryPin,
      isActive: true,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setStaffList([...staffList, staff]);
    setSuccessMessage(
      `スタッフを登録しました。\n社員番号: ${employeeId}\n仮PIN: ${temporaryPin}\n\n登録情報を ${newStaff.email} に送信しました。`,
    );
    setNewStaff({ name: "", email: "" });
  };

  const handleDeleteStaff = (id: string) => {
    if (confirm("このスタッフを削除してもよろしいですか？")) {
      setStaffList(staffList.filter((staff) => staff.id !== id));
    }
  };

  return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant='h4' fontWeight={700} gutterBottom>
            スタッフ管理
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            スタッフの登録・管理を行います
          </Typography>
        </Box>

        {/* アクションツールバー */}
        <Paper sx={{ mb: 3 }}>
          <Toolbar>
            <Typography variant='h6' sx={{ flex: 1 }}>
              スタッフ一覧（{staffList.length}名）
            </Typography>

            {/* <Button
              variant='outlined'
              startIcon={<AccountTree />}
              onClick={() => navigate("/staff-auth-flow")}
              sx={{ mr: 2 }}
            >
              認証フロー図
            </Button> */}

            <Button
              variant='contained'
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

        {/* スタッフ一覧テーブル */}
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
                <TableCell align='center'>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staffList.map((staff) => (
                <TableRow key={staff.id} hover>
                  <TableCell>
                    <strong>{staff.employeeId}</strong>
                  </TableCell>
                  <TableCell>{staff.name}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={staff.role === "staff" ? "スタッフ" : "管理者"}
                      size='small'
                      color={staff.role === "staff" ? "default" : "primary"}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={staff.isActive ? "有効" : "無効"}
                      size='small'
                      color={staff.isActive ? "success" : "default"}
                    />
                  </TableCell>
                  <TableCell>{staff.createdAt}</TableCell>
                  <TableCell align='center'>
                    <IconButton
                      size='small'
                      color='primary'
                      onClick={() => handleViewDetail(staff)}
                      title='詳細表示'
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton size='small' color='default' title='編集'>
                      <Edit />
                    </IconButton>
                    <IconButton
                      size='small'
                      color='error'
                      onClick={() => handleDeleteStaff(staff.id)}
                      title='削除'
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 新規登録ダイアログ */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth='sm'
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Person sx={{ mr: 1, color: "#1976d2" }} />
              新規スタッフ登録
            </Box>
          </DialogTitle>
          <DialogContent>
            {successMessage ? (
              <Alert
                severity='success'
                sx={{ whiteSpace: "pre-line", fontWeight: 600 }}
              >
                {successMessage}
              </Alert>
            ) : (
              <Box sx={{ pt: 2 }}>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ mb: 3 }}
                >
                  スタッフ情報を入力してください。社員番号と仮PINは自動生成されます。
                </Typography>

                <TextField
                  fullWidth
                  label='氏名'
                  value={newStaff.name}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, name: e.target.value })
                  }
                  placeholder='例: 山田太郎'
                  InputProps={{
                    startAdornment: (
                      <Person sx={{ mr: 1, color: "action.active" }} />
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label='メールアドレス'
                  type='email'
                  value={newStaff.email}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, email: e.target.value })
                  }
                  placeholder='例: yamada@example.com'
                  InputProps={{
                    startAdornment: (
                      <Email sx={{ mr: 1, color: "action.active" }} />
                    ),
                  }}
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
                  <Typography variant='body2' fontWeight={600} gutterBottom>
                    📋 自動生成される情報
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    • 社員番号: 自動採番（EMP001, EMP002...）
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    • 仮PIN: ランダム4桁数字
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    • 役割: スタッフ
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
                  <Typography variant='body2' fontWeight={600} gutterBottom>
                    📧 メール送信内容
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    登録完了後、以下の情報がメールで送信されます：
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    • 社員番号
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    • 仮PIN
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    • 初回ログインURL
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            {successMessage ? (
              <Button onClick={handleCloseDialog} variant='contained'>
                閉じる
              </Button>
            ) : (
              <>
                <Button onClick={handleCloseDialog}>キャンセル</Button>
                <Button
                  variant='contained'
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
              </>
            )}
          </DialogActions>
        </Dialog>

        {/* 詳細表示ダイアログ */}
        <Dialog
          open={openDetailDialog}
          onClose={() => setOpenDetailDialog(false)}
          maxWidth='sm'
          fullWidth
        >
          <DialogTitle>スタッフ詳細</DialogTitle>
          <DialogContent>
            {selectedStaff && (
              <Box sx={{ pt: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary'>
                    社員番号
                  </Typography>
                  <Typography variant='h6' fontWeight={700}>
                    {selectedStaff.employeeId}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary'>
                    氏名
                  </Typography>
                  <Typography variant='body1'>{selectedStaff.name}</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary'>
                    メールアドレス
                  </Typography>
                  <Typography variant='body1'>{selectedStaff.email}</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary'>
                    仮PIN
                  </Typography>
                  <Box
                    sx={{
                      display: "inline-block",
                      bgcolor: "#fff3e0",
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      fontFamily: "monospace",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      letterSpacing: "0.3em",
                    }}
                  >
                    {selectedStaff.temporaryPin}
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary'>
                    役割
                  </Typography>
                  <Chip
                    label={
                      selectedStaff.role === "staff" ? "スタッフ" : "管理者"
                    }
                    color={
                      selectedStaff.role === "staff" ? "default" : "primary"
                    }
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary'>
                    ステータス
                  </Typography>
                  <Chip
                    label={selectedStaff.isActive ? "有効" : "無効"}
                    color={selectedStaff.isActive ? "success" : "default"}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary'>
                    登録日
                  </Typography>
                  <Typography variant='body1'>
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
