"use client";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { TestingTask } from "@/context/SessionsContext";

interface SessionTasksAccordionProps {
  tasks: TestingTask[];
}

export default function SessionTasksAccordion({
  tasks,
}: SessionTasksAccordionProps) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>View {tasks.length} task(s)</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {tasks.map((task, i) => (
          <Accordion key={i}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {i + 1}
                {task.title ? ` - ${task.title}` : ""}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <Typography component={"span"} fontWeight="bold">
                  Scenario:
                </Typography>{" "}
                {task.scenario}
              </Typography>
              <Typography>
                <Typography component={"span"} fontWeight="bold">
                  Instructions:
                </Typography>
                {task.instructions}
              </Typography>
              {task.successCriteria && (
                <Typography>
                  <Typography component={"span"} fontWeight="bold">
                    Success Criteria:
                  </Typography>
                  {task.successCriteria}
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
