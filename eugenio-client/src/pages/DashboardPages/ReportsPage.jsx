import React, { useRef } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import Stack from "@mui/material/Stack";
import {
  Typography,
  Box,
  Paper,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import NUBE from "../../assets/img/nubdexchange_logo.png";

const enrollmentPeriods = [
  "July '22",
  "October '22",
  "February '23",
  "July '23",
  "October '23",
  "February '24",
  "July '24",
  "October '24",
  "February '25",
  "July '25",
  "October '25",
  "February '26",
];

const enrollmentCounts = [35, 45, 55, 65, 70, 75, 80, 90, 100, 110, 125, 150];

const departmentData = [
  { id: 0, value: 34, label: "Engineering" },
  { id: 1, value: 24, label: "Business" },
  { id: 2, value: 18, label: "Sciences" },
  { id: 3, value: 14, label: "Arts" },
  { id: 4, value: 10, label: "ICT" },
];

const gradeSeries = [{ data: [88, 91, 85, 93, 87], label: "Average GPA" }];

const faculties = ["Engineering", "Business", "Sciences", "Arts", "ICT"];

const kpis = [
  { label: "New Applications", value: "1,250" },
  { label: "Offer Rate", value: "72%" },
  { label: "Graduation Rate", value: "84%" },
  { label: "Course Completion", value: "91%" },
];

const ReportsPage = () => {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank", "width=1200,height=900");
    if (!printWindow) return;

    const headMarkup = Array.from(
      document.querySelectorAll('style, link[rel="stylesheet"]'),
    )
      .map((node) => node.outerHTML)
      .join("");

    const exportedAt = new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date());

    printWindow.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Report Export</title>
${headMarkup}
<style>
@page {
  size: A4;
  margin: 16mm;
}
html, body {
  margin: 0;
  padding: 0;
  background: #fff;
}
body {
  font-family: Arial, Helvetica, sans-serif;
  color: #1f2937;
}
.report-shell {
  padding: 28px;
  background: #fff;
}
.report-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 14px;
  border-bottom: 1px solid #d1d5db;
}
.report-header img {
  height: 60px;
  width: auto;
}
.report-header-text h1 {
  margin: 0 0 6px;
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
}
.report-header-text p {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
}
.kpi-section {
  margin-bottom: 24px;
}
.kpi-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1f2937;
}
.kpi-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.kpi-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}
.kpi-card-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}
.kpi-card-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}
.charts-section {
  margin-top: 24px;
}
.chart-container {
  margin-bottom: 24px;
  page-break-inside: avoid;
}
.chart-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #1f2937;
}
.chart-description {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 12px;
  line-height: 1.5;
}
.report-content .MuiBox-root {
  break-inside: avoid;
  page-break-inside: avoid;
}
.report-content {
  transform: scale(1);
  transform-origin: top left;
}
@media print {
  body { margin: 0; padding: 0; }
  .report-shell { padding: 28px; }
}
</style>
</head>
<body>
<div class="report-shell">
  <div class="report-header">
    <img src="${NUBE}" alt="NU Shield" style="height: 60px;" />
    <div class="report-header-text">
      <h1>Bulldogs Exchange</h1>
      <p>Report Export • ${exportedAt}</p>
    </div>
  </div>
  
  <div class="report-content">
    ${printContent.innerHTML}
  </div>
</div>
</body>
</html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header with Export Button */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h4">Reports</Typography>
        <Button variant="contained" onClick={handlePrint}>
          Export PDF
        </Button>
      </Box>

      {/* Printable Content */}
      <Box ref={printRef} sx={{ width: "100%" }}>
        {/* KPI Cards Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Key Performance Indicators
          </Typography>
          <Grid container spacing={2}>
            {kpis.map((kpi) => (
              <Grid item xs={12} sm={6} md={3} key={kpi.label}>
                <Card
                  sx={{
                    textAlign: "center",
                    boxShadow: "none",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="caption"
                      sx={{ color: "#6b7280", display: "block", mb: 1 }}
                    >
                      {kpi.label}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {kpi.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Enrollment Trend Chart */}
        <Box sx={{ mb: 4, width: "100%", overflow: "hidden" }}>
          <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
            Enrollment Trend
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#6b7280", mb: 2, fontSize: "13px" }}
          >
            Historical student enrollment data across academic periods showing
            growth trajectory and enrollment patterns.
          </Typography>
          <Paper
            sx={{
              p: 2,
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              backgroundColor: "#fff",
            }}
          >
            <LineChart
              xAxis={[
                {
                  data: enrollmentPeriods,
                  scaleType: "point",
                },
              ]}
              series={[
                {
                  data: enrollmentCounts,
                  label: "Students",
                },
              ]}
              height={320}
              width={undefined}
              margin={{ top: 10, bottom: 20, left: 30, right: 10 }}
            />
          </Paper>
        </Box>

        {/* Department Distribution Chart */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
            Department Distribution
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#6b7280", mb: 2, fontSize: "13px" }}
          >
            Distribution of students across academic departments, showing
            relative enrollment sizes by faculty area.
          </Typography>
          <Paper
            sx={{
              p: 3,
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              backgroundColor: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PieChart
              series={[{ data: departmentData }]}
              width={400}
              height={300}
              margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
            />
          </Paper>
        </Box>

        {/* Average GPA Chart */}
        <Box sx={{ mb: 4, width: "100%", overflow: "hidden" }}>
          <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
            Average GPA by Faculty
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#6b7280", mb: 2, fontSize: "13px" }}
          >
            Academic performance metrics comparing average GPA across different
            faculty departments and specializations.
          </Typography>
          <Paper
            sx={{
              p: 2,
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              backgroundColor: "#fff",
            }}
          >
            <BarChart
              series={gradeSeries}
              xAxis={[
                {
                  data: faculties,
                  scaleType: "band",
                  label: "Faculty",
                },
              ]}
              height={320}
              width={undefined}
              margin={{ top: 10, bottom: 40, left: 30, right: 10 }}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ReportsPage;
