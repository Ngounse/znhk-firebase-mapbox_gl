import { Box, IconButton, Skeleton, Stack } from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function CardLoading() {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      flex={1}
      sx={{
        border: "1px solid #e2e2e1",
        borderRadius: 1,
        pl: 1,
      }}
    >
      <Skeleton
        variant="rounded"
        sx={{
          bgcolor: "gainsboro",
        }}
        width={"100%"}
        height={18}
      />
      <ZNHKIconButton icon={<EditIcon />} />
      <ZNHKIconButton icon={<DeleteIcon />} />
    </Box>
  );
}

export const CardList = () => {
  return (
    <Stack gap={1}>
      <CardLoading />
      <CardLoading />
      <CardLoading />
      <CardLoading />
    </Stack>
  );
};

const ZNHKIconButton = (props: any) => {
  const { icon } = props;

  return (
    <IconButton
      aria-label="delete"
      sx={{
        color: "#cacaca",
      }}
    >
      {icon}
    </IconButton>
  );
};
