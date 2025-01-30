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
import AssessmentIcon from "@mui/icons-material/Assessment";
import type { Analysis, Session } from "@/context/SessionsContext";

interface SessionCardProps {
  session: Session;
  removeSession: (sessionId: string) => void;
  removeSessionAnalysis: (sessionId: string) => void;
  updateSessionAnalysis: (sessionId: string, analysis?: Analysis) => void;
  onView: (sessionId: string) => void;
}

export default function SessionCard({
  session,
  removeSession,
  removeSessionAnalysis,
  updateSessionAnalysis,
  onView,
}: SessionCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

  return (
    <Card
      onClick={() => onView(session.id)}
      variant="outlined"
      sx={{
        position: "relative",
        ":hover": { boxShadow: 2, cursor: "pointer" },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">{session.name}</Typography>
            <Typography variant="body2">
              {session.tasks.length} tasks - {session.userTests.length} user
              tests
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          </Box>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem
              onClick={(e) => {
                onView(session.id);
                handleMenuClose(e);
              }}
            >
              <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
              View
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                updateSessionAnalysis(session.id);
                handleMenuClose(e);
              }}
            >
              <AssessmentIcon fontSize="small" sx={{ mr: 1 }} />
              Update Analysis
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                removeSessionAnalysis(session.id);
                handleMenuClose(e);
              }}
            >
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Remove Analysis
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                removeSession(session.id);
                handleMenuClose(e);
              }}
            >
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Remove Session
            </MenuItem>
          </Menu>
        </Box>
        <Box display="flex" mt={2}>
          <Box flex={1}></Box>
          <Box flex={1} pl={2}>
            <Typography variant="subtitle2">Analysis</Typography>
            <Typography variant="body2" color="text.secondary">
              {session.analysis
                ? session.analysis.overallPassRate
                : "No details provided."}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
