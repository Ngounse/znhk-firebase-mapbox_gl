import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";

export default function TodoCard(props: any) {
  const {
    children,
    todoKey,
    handleDelete,
    handleAddEdit,
    edittedValue,
    setEdittedValue,
    handleEditTodo,
    edit,
  } = props;

  console.log("edit::: ", edit);

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      flex={1}
      sx={{
        border: "1px solid #e2e2e1",
        borderRadius: 1,
        pl: !(edit === todoKey) ? 1 : 0,
      }}
    >
      {!(edit === todoKey) ? (
        <Typography noWrap flex={1} variant="body2">
          {children}
        </Typography>
      ) : (
        <TextField
          fullWidth
          variant="outlined"
          value={edittedValue}
          onChange={(e) => setEdittedValue(e.target.value)}
          size="small"
          sx={{
            borderRadius: 1,
            bgcolor: "#cacaca",
          }}
        />
      )}

      {!(edit === todoKey) ? (
        <IconButton
          onClick={handleAddEdit(todoKey)}
          aria-label="delete"
          sx={{
            color: "#cacaca",
            "& :hover": {
              color: "cyan",
            },
          }}
        >
          <EditIcon />
        </IconButton>
      ) : (
        <IconButton
          onClick={handleEditTodo}
          aria-label="delete"
          sx={{
            color: "#cacaca",
            "& :hover": {
              color: "cyan",
            },
          }}
        >
          <DoneIcon />
        </IconButton>
      )}

      <IconButton
        onClick={handleDelete(todoKey)}
        aria-label="delete"
        sx={{
          color: "#cacaca",
          "& :hover": {
            color: "red",
          },
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}
