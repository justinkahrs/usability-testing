"use client";
import React, { useState, type MouseEvent } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import type { UserTest } from "@/context/SessionsContext";

interface UserTestCardProps {
  sessionId: string;
  userTest: UserTest;
  totalTasks: number;
  onView: (sessionId: string, userTestId: string) => void;
  onDelete: (userTestId: string) => void;
}

export default function UserTestCard({
  sessionId,
  userTest,
  totalTasks,
  onView,
  onDelete,
}: UserTestCardProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (e: MouseEvent<HTMLElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = (e: MouseEvent<HTMLElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setAnchorEl(null);
  };

  const passedCount = userTest.taskResults.filter((t) => t.pass).length;

  return (
    <Card
      onClick={() => onView(sessionId, userTest.id)}
      variant="outlined"
      sx={{
        position: "relative",
        ":hover": { boxShadow: 2, cursor: "pointer" },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">
              {userTest.firstName} {userTest.lastName}
            </Typography>
            <Typography variant="body2">
              {userTest.title} - {userTest.department}
            </Typography>
            <Typography variant="body2">
              Tested on: {userTest.dateOfTest}
            </Typography>
            <Typography variant="body2">
              {passedCount} / {totalTasks} passed
            </Typography>
          </Box>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleMenuOpen(e);
            }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => {
                onView(sessionId, userTest.id);
                handleMenuClose();
              }}
            >
              <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
              View
            </MenuItem>
            <MenuItem
              onClick={() => {
                onDelete(userTest.id);
                handleMenuClose();
              }}
            >
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>
        </Box>
      </CardContent>
    </Card>
  );
}
