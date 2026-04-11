import { Container, Typography } from "@mui/material";

export default function Reports() {
  return (

    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
        レポート
      </Typography>
      <Typography variant="body1" color="text.secondary">
        レポート画面は現在開発中です。
      </Typography>
    </Container>

  );
}
