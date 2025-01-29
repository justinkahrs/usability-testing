"use client";

import React, { useEffect, useState, useRef /* type RefObject */ } from "react";
import { Box, IconButton, Stack } from "@mui/material";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
// import { TransitionGroup, CSSTransition } from "react-transition-group";
import TaskItem from "./TaskItem";
import type { TestingTask } from "@/context/SessionsContext";
import UserTestTaskItem from "./UserTestTaskItem";

interface TaskCarouselProps {
  tasks: TestingTask[];
  taskResults: { [taskId: string]: { pass: boolean; comments: string } };
  onToggle: (taskId: string) => void;
  onCommentsChange: (taskId: string, comments: string) => void;
  onAllViewedChange?: (allViewed: boolean) => void;
  readOnly?: boolean;
}

export default function TaskCarousel({
  readOnly,
  tasks,
  taskResults,
  onToggle,
  onCommentsChange,
  onAllViewedChange,
}: TaskCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [direction, setDirection] = useState<"left" | "right">("left");
  const visitedRef = useRef<Set<number>>(new Set([0]));
  // const nodeRefs = useRef<Record<string, RefObject<HTMLDivElement>>>({});
  const currentTask = tasks[currentIndex];
  const currentResult = taskResults[currentTask.id] || {
    pass: false,
    comments: "",
  };

  // function getNodeRef(taskId: string) {
  //   if (!nodeRefs.current[taskId]) {
  //     nodeRefs.current[taskId] = React.createRef<HTMLDivElement>();
  //   }
  //   return nodeRefs.current[taskId];
  // }

  const handlePrev = () => {
    // setDirection("right");
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : tasks.length - 1));
  };

  const handleNext = () => {
    // setDirection("left");
    setCurrentIndex((prev) => (prev < tasks.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    visitedRef.current.add(currentIndex);
    onAllViewedChange?.(visitedRef.current.size === tasks.length);
  }, [currentIndex, tasks.length, onAllViewedChange]);

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <IconButton onClick={handlePrev}>
          <ArrowBackIos className="carouselArrow" />
        </IconButton>

        <Box flexGrow={1} sx={{ overflow: "hidden", position: "relative" }}>
          {/* <TransitionGroup component={null}>
            <CSSTransition
              key={currentTask.id}
              nodeRef={getNodeRef(currentTask.id)}
              classNames={`slide-${direction}`}
              timeout={300}
            >
              <Box
                ref={getNodeRef(currentTask.id)}
                sx={{ width: "100%", position: "absolute" }}
              > */}
          {readOnly ? (
            <UserTestTaskItem
              key={currentTask.id}
              task={currentTask}
              pass={currentResult.pass}
              comments={currentResult.comments}
            />
          ) : (
            <TaskItem
              key={currentTask.id}
              task={currentTask}
              passValue={currentResult.pass}
              commentsValue={currentResult.comments}
              onToggle={onToggle}
              onCommentsChange={onCommentsChange}
            />
          )}
          {/* </Box>
            </CSSTransition>
          </TransitionGroup> */}
        </Box>

        <IconButton onClick={handleNext}>
          <ArrowForwardIos className="carouselArrow" />
        </IconButton>
      </Stack>
    </Box>
  );
}
