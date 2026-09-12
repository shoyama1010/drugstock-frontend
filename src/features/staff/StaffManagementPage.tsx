import {
  useEffect,
  useState,
} from "react";

import api from "../../api/clients";

import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";

import { Add } from "@mui/icons-material";

import StaffTable, {
  type Staff,
} from "./components/StaffTable";

import StaffRegisterDialog from "./components/StaffRegisterDialog";

import StaffRegisteredResultDialog, {
  type RegisteredStaffInfo,
} from "./components/StaffRegisteredResultDialog";

import StaffDetailDialog from "./components/StaffDetailDialog";

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
  const [staffList, setStaffList] =
    useState<Staff[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [registering, setRegistering] =
    useState(false);

  // 新規登録モーダル
  const [openDialog, setOpenDialog] =
    useState(false);

  // 詳細モーダル
  const [
    openDetailDialog,
    setOpenDetailDialog,
  ] = useState(false);

  const [
    selectedStaff,
    setSelectedStaff,
  ] = useState<Staff | null>(null);

  // 登録結果モーダル
  const [
    registeredStaffInfo,
    setRegisteredStaffInfo,
  ] =
    useState<RegisteredStaffInfo | null>(
      null,
    );

  const [newStaff, setNewStaff] =
    useState({
      name: "",
      email: "",
    });

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    copyMessage,
    setCopyMessage,
  ] = useState("");

  const mapStaff = (
    staff: StaffApiResponse,
  ): Staff => {
    return {
      id: String(staff.id),

      employeeId:
        staff.employee_code,

      name: staff.name,

      email:
        staff.email ?? "未登録",

      role: staff.role,

      isActive:
        Boolean(staff.is_active),

      createdAt:
        staff.created_at?.slice(
          0,
          10,
        ) ?? "",

      updatedAt:
        staff.updated_at,
    };
  };

  const fetchStaffList =
    async () => {
      try {
        setLoading(true);

        const res =
          await api.get<
            StaffApiResponse[]
          >("/staffs");

        const mapped =
          res.data.map(mapStaff);

        setStaffList(mapped);
      } catch (error: any) {
        console.error(
          "スタッフ一覧取得エラー",
          error,
        );

        setErrorMessage(
          error.response?.data
            ?.message ||
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

  const handleViewDetail = (
    staff: Staff,
  ) => {
    setSelectedStaff(staff);

    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog =
    () => {
      setOpenDetailDialog(false);

      setSelectedStaff(null);
    };

  const handleRegisterStaff =
    async () => {
      if (
        !newStaff.name.trim() ||
        !newStaff.email.trim()
      ) {
        setErrorMessage(
          "氏名とメールアドレスを入力してください。",
        );

        return;
      }

      try {
        setRegistering(true);

        setErrorMessage("");
        setSuccessMessage("");

        const res =
          await api.post<
            StaffRegisterResponse
          >("/staffs", {
            name:
              newStaff.name.trim(),

            email:
              newStaff.email.trim(),
          });

        const registeredData =
          res.data.data;

        if (
          !registeredData ||
          !registeredData.employee_code ||
          !registeredData.temporary_pin
        ) {
          throw new Error(
            "登録結果に社員番号または仮PINがありません。",
          );
        }

        setRegisteredStaffInfo({
          name:
            registeredData.name ||
            newStaff.name.trim(),

          employeeCode:
            registeredData.employee_code,

          temporaryPin:
            String(
              registeredData.temporary_pin,
            ),
        });

        setSuccessMessage(
          res.data.message ||
          "スタッフを登録しました。",
        );

        setOpenDialog(false);

        setNewStaff({
          name: "",
          email: "",
        });

        await fetchStaffList();

      } catch (error: any) {
        console.error(
          "スタッフ登録エラー",
          error,
        );

        console.error(
          "response",
          error.response,
        );

        console.error(
          "data",
          error.response?.data,
        );

        if (
          error.response?.status ===
          422
        ) {
          const errors =
            error.response?.data
              ?.errors as
            | ValidationErrors
            | undefined;

          if (errors) {
            const firstKey =
              Object.keys(
                errors,
              )[0];

            const firstMessage =
              firstKey
                ? errors[
                firstKey
                ]?.[0]
                : undefined;

            setErrorMessage(
              firstMessage ||
              "入力内容を確認してください。",
            );
          } else {
            setErrorMessage(
              "入力内容を確認してください。",
            );
          }

          return;
        }

        setErrorMessage(
          error.response?.data
            ?.message ||
          error.message ||
          "スタッフ登録に失敗しました。",
        );

      } finally {
        setRegistering(false);
      }
    };

  const handleDeleteStaff =
    async (id: string) => {
      const confirmed =
        window.confirm(
          "このスタッフを削除してもよろしいですか？",
        );

      if (!confirmed) {
        return;
      }

      try {
        setSuccessMessage("");
        setErrorMessage("");

        await api.delete(
          `/staffs/${id}`,
        );

        await fetchStaffList();

        setSuccessMessage(
          "スタッフを削除しました。",
        );

      } catch (error: any) {
        console.error(
          "スタッフ削除エラー",
          error,
        );

        setErrorMessage(
          error.response?.data
            ?.message ||
          "スタッフ削除に失敗しました。",
        );
      }
    };

  const handleCopy = async (
    value: string,
    label:
      | "社員番号"
      | "仮PIN",
  ) => {
    try {
      await navigator.clipboard
        .writeText(value);

      setCopyMessage(
        `${label}をコピーしました。`,
      );

    } catch (error) {
      console.error(
        "コピーエラー",
        error,
      );

      setCopyMessage(
        "自動コピーに失敗しました。手動で控えてください。",
      );
    }
  };

  const handleCloseRegisteredResult =
    () => {
      setRegisteredStaffInfo(null);

      setSuccessMessage("");
      setCopyMessage("");
    };

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 4 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          gutterBottom
        >
          スタッフ管理
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          スタッフの登録・管理を行います
        </Typography>
      </Box>

      {errorMessage &&
        !openDialog && (
          <Alert
            severity="error"
            onClose={() =>
              setErrorMessage("")
            }
            sx={{ mb: 3 }}
          >
            {errorMessage}
          </Alert>
        )}

      {successMessage &&
        !registeredStaffInfo && (
          <Alert
            severity="success"
            onClose={() =>
              setSuccessMessage("")
            }
            sx={{ mb: 3 }}
          >
            {successMessage}
          </Alert>
        )}

      <Paper sx={{ mb: 3 }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flex: 1 }}
          >
            スタッフ一覧（
            {staffList.length}名）
          </Typography>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={
              handleOpenDialog
            }
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

      <StaffTable
        staffList={staffList}
        loading={loading}
        onViewDetail={
          handleViewDetail
        }
        onDeleteStaff={
          handleDeleteStaff
        }
      />

      <StaffRegisterDialog
        open={openDialog}
        registering={
          registering
        }
        newStaff={newStaff}
        errorMessage={
          errorMessage
        }
        onClose={
          handleCloseDialog
        }
        onRegister={
          handleRegisterStaff
        }
        onChangeName={(
          value,
        ) =>
          setNewStaff(
            (prev) => ({
              ...prev,
              name: value,
            }),
          )
        }
        onChangeEmail={(
          value,
        ) =>
          setNewStaff(
            (prev) => ({
              ...prev,
              email: value,
            }),
          )
        }
      />

      <StaffRegisteredResultDialog
        staffInfo={
          registeredStaffInfo
        }
        successMessage={
          successMessage
        }
        copyMessage={
          copyMessage
        }
        onCopy={handleCopy}
        onClose={
          handleCloseRegisteredResult
        }
      />

      <StaffDetailDialog
        open={
          openDetailDialog
        }
        staff={
          selectedStaff
        }
        onClose={
          handleCloseDetailDialog
        }
      />
    </Container>
  );
}