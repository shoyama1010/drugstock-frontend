// import { useEffect, useState } from "react";
// import api from "../../api/clients";
// import {
//   Box,
//   Container,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Alert,
//   Toolbar,
//   CircularProgress,
// } from "@mui/material";

// import {
//   Add,
//   Person,
//   Visibility,
//   Edit,
//   Delete,
// } from "@mui/icons-material";

// interface Staff {
//   id: string;
//   employeeId: string;
//   name: string;
//   email: string;
//   role: string;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt?: string;
// }

// interface StaffApiResponse {
//   id: number | string;
//   employee_code: string;
//   name: string;
//   email: string;
//   role: string;
//   is_active: boolean;
//   created_at: string;
//   updated_at?: string;
// }

// export default function StaffManagementPage() {
//   const [staffList, setStaffList] = useState<Staff[]>([]);
//   const [loading, setLoading] = useState(false);

//   const [openDialog, setOpenDialog] = useState(false);
//   const [openDetailDialog, setOpenDetailDialog] = useState(false);
//   const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

//   const [newStaff, setNewStaff] = useState({
//     name: "",
//     email: "",
//   });

//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   const mapStaff = (staff: StaffApiResponse): Staff => {
//     return {
//       id: String(staff.id),
//       employeeId: staff.employee_code,
//       name: staff.name,
//       email: staff.email,
//       role: staff.role,
//       isActive: Boolean(staff.is_active),
//       createdAt: staff.created_at?.slice(0, 10) ?? "",
//       updatedAt: staff.updated_at,
//     };
//   };

//   const fetchStaffList = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/staffs");
//       const mapped = (res.data as StaffApiResponse[]).map(mapStaff);
//       setStaffList(mapped);
//     } catch (error: any) {
//       console.error("スタッフ一覧取得エラー", error);
//       setErrorMessage(
//         error.response?.data?.message || "スタッフ一覧の取得に失敗しました。"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStaffList();
//   }, []);

//   const handleOpenDialog = () => {
//     setOpenDialog(true);
//     setSuccessMessage("");
//     setErrorMessage("");
//     setNewStaff({ name: "", email: "" });
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setNewStaff({ name: "", email: "" });
//     setErrorMessage("");
//   };

//   const handleViewDetail = (staff: Staff) => {
//     setSelectedStaff(staff);
//     setOpenDetailDialog(true);
//   };

//   const handleRegisterStaff = async () => {
//     console.log("handleRegisterStaff 実行");

//     try {
//       setErrorMessage("");

//       console.log("送信データ", {
//         name: newStaff.name,
//         email: newStaff.email,
//       });

//       const res = await api.post("/staffs", {
//         name: newStaff.name,
//         email: newStaff.email,
//       });

//       console.log("登録成功", res.data);

//       setSuccessMessage(
//         `登録成功！
//       社員番号: ${res.data.data.employee_code}
//       仮PIN: ${res.data.data.temporary_pin}`
//       );

//       await fetchStaffList();

//       setNewStaff({ name: "", email: "" });

//       setTimeout(() => {
//         setOpenDialog(false);
//         setSuccessMessage("");
//       }, 1200);

//     } catch (error: any) {
//       console.error("スタッフ登録エラー", error);
//       console.error("response", error.response);
//       console.error("data", error.response?.data);

//       if (error.response?.status === 422) {
//         const errors = error.response.data.errors;
//         const firstKey = Object.keys(errors)[0];
//         setErrorMessage(errors[firstKey][0]);
//         return;
//       }

//       setErrorMessage(
//         error.response?.data?.message || "スタッフ登録に失敗しました。"
//       );
//     }
//   };

//   const handleDeleteStaff = async (id: string) => {
//     if (!window.confirm("このスタッフを削除してもよろしいですか？")) {
//       return;
//     }

//     try {
//       setSuccessMessage("");
//       setErrorMessage("");

//       await api.delete(`/staffs/${id}`);
//       await fetchStaffList();
//     } catch (error: any) {
//       console.error("スタッフ削除エラー", error);
//       setErrorMessage(
//         error.response?.data?.message || "スタッフ削除に失敗しました。"
//       );
//     }
//   };

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="h4" fontWeight={700} gutterBottom>
//           スタッフ管理
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           スタッフの登録・管理を行います
//         </Typography>
//       </Box>

//       {errorMessage && !openDialog && (
//         <Alert severity="error" sx={{ mb: 3 }}>
//           {errorMessage}
//         </Alert>
//       )}

//       <Paper sx={{ mb: 3 }}>
//         <Toolbar>
//           <Typography variant="h6" sx={{ flex: 1 }}>
//             スタッフ一覧（{staffList.length}名）
//           </Typography>

//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={handleOpenDialog}
//             sx={{
//               bgcolor: "#1976d2",
//               "&:hover": {
//                 bgcolor: "#1565c0",
//               },
//             }}
//           >
//             新規スタッフ登録
//           </Button>
//         </Toolbar>
//       </Paper>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow sx={{ bgcolor: "#f5f5f5" }}>
//               <TableCell>社員番号</TableCell>
//               <TableCell>氏名</TableCell>
//               <TableCell>メールアドレス</TableCell>
//               <TableCell>役割</TableCell>
//               <TableCell>ステータス</TableCell>
//               <TableCell>登録日</TableCell>
//               <TableCell align="center">操作</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={7} align="center">
//                   <Box sx={{ py: 4 }}>
//                     <CircularProgress size={28} />
//                   </Box>
//                 </TableCell>
//               </TableRow>
//             ) : staffList.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={7} align="center">
//                   スタッフが登録されていません。
//                 </TableCell>
//               </TableRow>
//             ) : (
//               staffList.map((staff) => (
//                 <TableRow key={staff.id} hover>
//                   <TableCell>
//                     <strong>{staff.employeeId}</strong>
//                   </TableCell>
//                   <TableCell>{staff.name}</TableCell>
//                   <TableCell>{staff.email}</TableCell>
//                   <TableCell>
//                     <Chip
//                       label={staff.role === "staff" ? "スタッフ" : "管理者"}
//                       size="small"
//                       color={staff.role === "staff" ? "default" : "primary"}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Chip
//                       label={staff.isActive ? "有効" : "無効"}
//                       size="small"
//                       color={staff.isActive ? "success" : "default"}
//                     />
//                   </TableCell>
//                   <TableCell>{staff.createdAt}</TableCell>
//                   <TableCell align="center">
//                     <IconButton
//                       size="small"
//                       color="primary"
//                       onClick={() => handleViewDetail(staff)}
//                       title="詳細表示"
//                     >
//                       <Visibility />
//                     </IconButton>
//                     <IconButton size="small" color="default" title="編集">
//                       <Edit />
//                     </IconButton>
//                     <IconButton
//                       size="small"
//                       color="error"
//                       onClick={() => handleDeleteStaff(staff.id)}
//                       title="削除"
//                     >
//                       <Delete />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Dialog
//         open={openDialog}
//         onClose={handleCloseDialog}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <Person sx={{ mr: 1, color: "#1976d2" }} />
//             新規スタッフ登録
//           </Box>
//         </DialogTitle>

//         <DialogContent>
//           <Box sx={{ pt: 2 }}>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//               スタッフ情報を入力してください。社員番号と仮PINは自動生成されます。
//             </Typography>

//             {errorMessage && (
//               <Alert severity="error" sx={{ mb: 2 }}>
//                 {errorMessage}
//               </Alert>
//             )}

//             {successMessage && (
//               <Alert severity="success" sx={{ mb: 2 }}>
//                 {successMessage}
//               </Alert>
//             )}

//             <TextField
//               fullWidth
//               label="氏名"
//               value={newStaff.name}
//               onChange={(e) =>
//                 setNewStaff({ ...newStaff, name: e.target.value })
//               }
//               placeholder="例: 山田太郎"
//               sx={{ mb: 2 }}
//             />

//             <TextField
//               fullWidth
//               label="メールアドレス"
//               type="email"
//               value={newStaff.email}
//               onChange={(e) =>
//                 setNewStaff({ ...newStaff, email: e.target.value })
//               }
//               placeholder="例: yamada@example.com"
//               sx={{ mb: 2 }}
//             />

//             <Box
//               sx={{
//                 bgcolor: "#e3f2fd",
//                 p: 2,
//                 borderRadius: 1,
//                 border: "1px solid #90caf9",
//               }}
//             >
//               <Typography variant="body2" fontWeight={600} gutterBottom>
//                 📋 自動生成される情報
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 ・社員番号: 自動採番（EMP001, EMP002...）
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 ・仮PIN: ランダム4桁数字
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 ・役割: スタッフ
//               </Typography>
//             </Box>

//             <Box
//               sx={{
//                 bgcolor: "#fff3e0",
//                 p: 2,
//                 borderRadius: 1,
//                 border: "1px solid #ffb74d",
//                 mt: 2,
//               }}
//             >
//               <Typography variant="body2" fontWeight={600} gutterBottom>
//                 📧 メール送信内容
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 登録完了後、以下の情報がメールで送信されます：
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 ・社員番号
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 ・仮PIN
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 ・初回ログインURL
//               </Typography>
//             </Box>
//           </Box>
//         </DialogContent>

//         <DialogActions sx={{ px: 3, pb: 2 }}>
//           <Button onClick={handleCloseDialog}>キャンセル</Button>
//           <Button
//             variant="contained"
//             onClick={handleRegisterStaff}
//             disabled={!newStaff.name || !newStaff.email}
//             sx={{
//               bgcolor: "#1976d2",
//               "&:hover": {
//                 bgcolor: "#1565c0",
//               },
//             }}
//           >
//             登録してメール送信
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openDetailDialog}
//         onClose={() => setOpenDetailDialog(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>スタッフ詳細</DialogTitle>
//         <DialogContent>
//           {selectedStaff && (
//             <Box sx={{ pt: 2 }}>
//               <Box sx={{ mb: 2 }}>
//                 <Typography variant="body2" color="text.secondary">
//                   社員番号
//                 </Typography>
//                 <Typography variant="h6" fontWeight={700}>
//                   {selectedStaff.employeeId}
//                 </Typography>
//               </Box>

//               <Box sx={{ mb: 2 }}>
//                 <Typography variant="body2" color="text.secondary">
//                   氏名
//                 </Typography>
//                 <Typography variant="body1">{selectedStaff.name}</Typography>
//               </Box>

//               <Box sx={{ mb: 2 }}>
//                 <Typography variant="body2" color="text.secondary">
//                   メールアドレス
//                 </Typography>
//                 <Typography variant="body1">{selectedStaff.email}</Typography>
//               </Box>

//               <Box sx={{ mb: 2 }}>
//                 <Typography variant="body2" color="text.secondary">
//                   役割
//                 </Typography>
//                 <Chip
//                   label={selectedStaff.role === "staff" ? "スタッフ" : "管理者"}
//                   color={selectedStaff.role === "staff" ? "default" : "primary"}
//                 />
//               </Box>

//               <Box sx={{ mb: 2 }}>
//                 <Typography variant="body2" color="text.secondary">
//                   ステータス
//                 </Typography>
//                 <Chip
//                   label={selectedStaff.isActive ? "有効" : "無効"}
//                   color={selectedStaff.isActive ? "success" : "default"}
//                 />
//               </Box>

//               <Box sx={{ mb: 2 }}>
//                 <Typography variant="body2" color="text.secondary">
//                   登録日
//                 </Typography>
//                 <Typography variant="body1">
//                   {selectedStaff.createdAt}
//                 </Typography>
//               </Box>
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDetailDialog(false)}>閉じる</Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// }

import { useEffect, useState } from "react";
import api from "../../api/clients";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

import {
  Add,
  ContentCopy,
  Delete,
  Edit,
  Person,
  Visibility,
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
  email: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

interface RegisteredStaffInfo {
  name: string;
  employeeCode: string;
  temporaryPin: string;
}

interface StaffRegisterResponse {
  message?: string;
  data: {
    name: string;
    employee_code: string;
    temporary_pin: string | number;
  };
}

interface ValidationErrors {
  [key: string]: string[];
}

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);

  // 新規登録モーダル
  const [openDialog, setOpenDialog] = useState(false);

  // 詳細モーダル
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  // 登録結果モーダル
  const [registeredStaffInfo, setRegisteredStaffInfo] =
    useState<RegisteredStaffInfo | null>(null);

  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [copyMessage, setCopyMessage] = useState("");

  const mapStaff = (staff: StaffApiResponse): Staff => {
    return {
      id: String(staff.id),
      employeeId: staff.employee_code,
      name: staff.name,
      email: staff.email ?? "未登録",
      role: staff.role,
      isActive: Boolean(staff.is_active),
      createdAt: staff.created_at?.slice(0, 10) ?? "",
      updatedAt: staff.updated_at,
    };
  };

  const fetchStaffList = async () => {
    try {
      setLoading(true);

      const res = await api.get<StaffApiResponse[]>("/staffs");
      const mapped = res.data.map(mapStaff);

      setStaffList(mapped);
    } catch (error: any) {
      console.error("スタッフ一覧取得エラー", error);

      setErrorMessage(
        error.response?.data?.message ||
        "スタッフ一覧の取得に失敗しました。",
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
    setNewStaff({
      name: "",
      email: "",
    });
  };

  const handleCloseDialog = () => {
    if (registering) {
      return;
    }

    setOpenDialog(false);
    setNewStaff({
      name: "",
      email: "",
    });
    setErrorMessage("");
  };

  const handleViewDetail = (staff: Staff) => {
    setSelectedStaff(staff);
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedStaff(null);
  };

  const handleRegisterStaff = async () => {
    if (!newStaff.name.trim() || !newStaff.email.trim()) {
      setErrorMessage("氏名とメールアドレスを入力してください。");
      return;
    }

    try {
      setRegistering(true);
      setErrorMessage("");
      setSuccessMessage("");

      const res = await api.post<StaffRegisterResponse>("/staffs", {
        name: newStaff.name.trim(),
        email: newStaff.email.trim(),
      });

      const registeredData = res.data.data;

      if (
        !registeredData ||
        !registeredData.employee_code ||
        !registeredData.temporary_pin
      ) {
        throw new Error("登録結果に社員番号または仮PINがありません。");
      }

      // 登録結果を保存する
      setRegisteredStaffInfo({
        name: registeredData.name || newStaff.name.trim(),
        employeeCode: registeredData.employee_code,
        temporaryPin: String(registeredData.temporary_pin),
      });

      setSuccessMessage(
        res.data.message || "スタッフを登録しました。",
      );

      // 登録フォームを閉じる
      setOpenDialog(false);

      // 入力内容を初期化する
      setNewStaff({
        name: "",
        email: "",
      });

      // スタッフ一覧を更新する
      await fetchStaffList();
    } catch (error: any) {
      console.error("スタッフ登録エラー", error);
      console.error("response", error.response);
      console.error("data", error.response?.data);

      if (error.response?.status === 422) {
        const errors = error.response?.data
          ?.errors as ValidationErrors | undefined;

        if (errors) {
          const firstKey = Object.keys(errors)[0];
          const firstMessage = firstKey
            ? errors[firstKey]?.[0]
            : undefined;

          setErrorMessage(
            firstMessage || "入力内容を確認してください。",
          );
        } else {
          setErrorMessage("入力内容を確認してください。");
        }

        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "スタッフ登録に失敗しました。",
      );
    } finally {
      setRegistering(false);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    const confirmed = window.confirm(
      "このスタッフを削除してもよろしいですか？",
    );

    if (!confirmed) {
      return;
    }

    try {
      setSuccessMessage("");
      setErrorMessage("");

      await api.delete(`/staffs/${id}`);
      await fetchStaffList();

      setSuccessMessage("スタッフを削除しました。");
    } catch (error: any) {
      console.error("スタッフ削除エラー", error);

      setErrorMessage(
        error.response?.data?.message ||
        "スタッフ削除に失敗しました。",
      );
    }
  };

  const handleCopy = async (
    value: string,
    label: "社員番号" | "仮PIN",
  ) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyMessage(`${label}をコピーしました。`);
    } catch (error) {
      console.error("コピーエラー", error);
      setCopyMessage(
        "自動コピーに失敗しました。手動で控えてください。",
      );
    }
  };

  const handleCloseRegisteredResult = () => {
    setRegisteredStaffInfo(null);
    setSuccessMessage("");
    setCopyMessage("");
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
        <Alert
          severity="error"
          onClose={() => setErrorMessage("")}
          sx={{ mb: 3 }}
        >
          {errorMessage}
        </Alert>
      )}

      {successMessage && !registeredStaffInfo && (
        <Alert
          severity="success"
          onClose={() => setSuccessMessage("")}
          sx={{ mb: 3 }}
        >
          {successMessage}
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
                      label={
                        staff.role === "staff"
                          ? "スタッフ"
                          : "管理者"
                      }
                      size="small"
                      color={
                        staff.role === "staff"
                          ? "default"
                          : "primary"
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={staff.isActive ? "有効" : "無効"}
                      size="small"
                      color={
                        staff.isActive ? "success" : "default"
                      }
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

                    <IconButton
                      size="small"
                      color="default"
                      title="編集"
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() =>
                        handleDeleteStaff(staff.id)
                      }
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

      {/* 新規スタッフ登録モーダル */}
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
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              スタッフ情報を入力してください。社員番号と仮PINは
              自動生成されます。
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
                setNewStaff((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
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
                setNewStaff((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
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
            onClick={handleCloseDialog}
            disabled={registering}
          >
            キャンセル
          </Button>

          <Button
            variant="contained"
            onClick={handleRegisterStaff}
            disabled={
              registering ||
              !newStaff.name.trim() ||
              !newStaff.email.trim()
            }
            startIcon={
              registering ? (
                <CircularProgress size={18} color="inherit" />
              ) : undefined
            }
            sx={{
              bgcolor: "#1976d2",
              "&:hover": {
                bgcolor: "#1565c0",
              },
            }}
          >
            {registering ? "登録中..." : "スタッフを登録"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 登録結果モーダル */}
      <Dialog
        open={registeredStaffInfo !== null}
        onClose={(_, reason) => {
          // 背景クリックやEscキーでは閉じない
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
            {successMessage || "スタッフを登録しました。"}
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

            <Typography fontWeight={700} sx={{ mb: 2 }}>
              {registeredStaffInfo?.name}
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
                {registeredStaffInfo?.employeeCode}
              </Typography>

              <Button
                size="small"
                variant="outlined"
                startIcon={<ContentCopy />}
                onClick={() =>
                  handleCopy(
                    registeredStaffInfo?.employeeCode ?? "",
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
                {registeredStaffInfo?.temporaryPin}
              </Typography>

              <Button
                size="small"
                variant="outlined"
                startIcon={<ContentCopy />}
                onClick={() =>
                  handleCopy(
                    registeredStaffInfo?.temporaryPin ?? "",
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
            onClick={handleCloseRegisteredResult}
          >
            確認して閉じる
          </Button>
        </DialogActions>
      </Dialog>

      {/* スタッフ詳細モーダル */}
      <Dialog
        open={openDetailDialog}
        onClose={handleCloseDetailDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>スタッフ詳細</DialogTitle>

        <DialogContent>
          {selectedStaff && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  社員番号
                </Typography>

                <Typography variant="h6" fontWeight={700}>
                  {selectedStaff.employeeId}
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
                  {selectedStaff.name}
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
                  {selectedStaff.email}
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
                    selectedStaff.role === "staff"
                      ? "スタッフ"
                      : "管理者"
                  }
                  color={
                    selectedStaff.role === "staff"
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
                    selectedStaff.isActive ? "有効" : "無効"
                  }
                  color={
                    selectedStaff.isActive
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
                  {selectedStaff.createdAt}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDetailDialog}>
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}