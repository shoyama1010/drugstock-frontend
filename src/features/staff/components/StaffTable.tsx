import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import {
  Delete,
  Edit,
  Visibility,
} from "@mui/icons-material";

export interface Staff {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface StaffTableProps {
  staffList: Staff[];
  loading: boolean;
  onViewDetail: (staff: Staff) => void;
  onDeleteStaff: (id: string) => void;
}

export default function StaffTable({
  staffList,
  loading,
  onViewDetail,
  onDeleteStaff,
}: StaffTableProps) {
  return (
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
                      staff.isActive
                        ? "success"
                        : "default"
                    }
                  />
                </TableCell>

                <TableCell>{staff.createdAt}</TableCell>

                <TableCell align="center">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 0.5,
                      flexWrap: "nowrap",
                    }}
                  >
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onViewDetail(staff)}
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
                        onDeleteStaff(staff.id)
                      }
                      title="削除"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}