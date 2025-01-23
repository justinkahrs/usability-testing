"use client";

import { Breadcrumbs, Link, Typography } from "@mui/material";
import NextLink from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export default function BreadcrumbNav({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        if (crumb.href && !isLast) {
          return (
            <Link
              key={crumb.label}
              component={NextLink}
              href={crumb.href}
              underline="hover"
              color="inherit"
            >
              {crumb.label}
            </Link>
          );
        }
        return (
          <Typography key={crumb.label} color="text.primary">
            {crumb.label}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
}