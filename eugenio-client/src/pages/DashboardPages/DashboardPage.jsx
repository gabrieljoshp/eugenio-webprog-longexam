import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { DataGrid } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Gauge } from "@mui/x-charts/Gauge";
import { Typography, Card, CardContent } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css";

const studentColumns = [
  { field: "studentId", headerName: "Student ID", width: 130 },
  { field: "name", headerName: "Name", width: 200, editable: true },
  { field: "major", headerName: "Major", width: 180 },
  { field: "year", headerName: "Year", width: 120 },
  { field: "gpa", headerName: "GPA", type: "number", width: 100 },
  { field: "status", headerName: "Status", width: 140 },
];

const studentRows = [
  {
    id: 1,
    studentId: "STU1001",
    name: "Jon Snow",
    major: "Computer Science",
    year: "3rd Year",
    gpa: 3.6,
    status: "Active",
  },
  {
    id: 2,
    studentId: "STU1002",
    name: "Cersei Lannister",
    major: "Business Management",
    year: "4th Year",
    gpa: 3.9,
    status: "Active",
  },
  {
    id: 3,
    studentId: "STU1003",
    name: "Arya Stark",
    major: "Data Science",
    year: "2nd Year",
    gpa: 3.8,
    status: "Active",
  },
  {
    id: 4,
    studentId: "STU1004",
    name: "Daenerys Targaryen",
    major: "Public Administration",
    year: "4th Year",
    gpa: 3.7,
    status: "Graduating",
  },
  {
    id: 5,
    studentId: "STU1005",
    name: "Jaime Lannister",
    major: "Engineering",
    year: "3rd Year",
    gpa: 3.4,
    status: "Active",
  },
  {
    id: 6,
    studentId: "STU1006",
    name: "Sansa Stark",
    major: "Psychology",
    year: "2nd Year",
    gpa: 3.5,
    status: "Active",
  },
  {
    id: 7,
    studentId: "STU1007",
    name: "Tyrion Lannister",
    major: "Political Science",
    year: "4th Year",
    gpa: 3.7,
    status: "Active",
  },
  {
    id: 8,
    studentId: "STU1008",
    name: "Bran Stark",
    major: "Architecture",
    year: "1st Year",
    gpa: 3.2,
    status: "Active",
  },
  {
    id: 9,
    studentId: "STU1009",
    name: "Samwell Tarly",
    major: "Computer Science",
    year: "3rd Year",
    gpa: 3.6,
    status: "Active",
  },
];

const programs = [
  "Computer Science",
  "Business Management",
  "Engineering",
  "Psychology",
  "Data Science",
  "Architecture",
];
const facultyEnrollment = [
  { faculty: "Engineering", count: 230 },
  { faculty: "Business", count: 180 },
  { faculty: "Arts", count: 120 },
  { faculty: "Sciences", count: 160 },
  { faculty: "ICT", count: 140 },
];
const statusDistribution = [
  { id: 0, value: 72, label: "Active" },
  { id: 1, value: 18, label: "Graduating" },
  { id: 2, value: 10, label: "Inactive" },
];

function DashboardPage() {
  const totalStudents = studentRows.length;
  const activePrograms = programs.length;
  const averageGpa = (
    studentRows.reduce((total, student) => total + student.gpa, 0) /
    studentRows.length
  ).toFixed(2);
  const retentionRate = 92;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        University Dashboard
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 4 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6">Total Students</Typography>
            <Typography variant="h4">{totalStudents}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6">Active Programs</Typography>
            <Typography variant="h4">{activePrograms}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6">Average GPA</Typography>
            <Typography variant="h4">{averageGpa}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6">Retention Rate</Typography>
            <Typography variant="h4">{retentionRate}%</Typography>
          </CardContent>
        </Card>
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        sx={{ mb: 4, justifyContent: { md: "center" } }}
      >
        <Box
          sx={{
            borderRadius: "2.25rem",
            border: "2px solid #ddd",
            overflow: "hidden",
            p: 2,
            width: 150,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Gauge width={120} height={120} value={retentionRate} />
        </Box>

        <Box
          sx={{
            borderRadius: "2.25rem",
            border: "2px solid #ddd",
            overflow: "hidden",
            p: 2,
            width: 150,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Gauge
            width={120}
            height={120}
            value={87}
            valueMin={0}
            valueMax={100}
          />
        </Box>
      </Stack>

      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={3}
        sx={{ mb: 4, justifyContent: { lg: "center" } }}
      >
        <Box
          sx={{
            borderRadius: "2.25rem",
            border: "2px solid #ddd",
            p: 2,
            width: "100%",
            maxWidth: 900,
          }}
        >
          <BarChart
            series={[
              {
                data: facultyEnrollment.map((item) => item.count),
                label: "Enrollment",
              },
            ]}
            xAxis={[
              {
                data: facultyEnrollment.map((item) => item.faculty),
                scaleType: "band",
                label: "Faculty",
              },
            ]}
            height={320}
          />
        </Box>

        <Box
          sx={{
            borderRadius: "2.25rem",
            border: "2px solid #ddd",
            p: 5,
            width: "100%",
            maxWidth: 500,
          }}
        >
          <PieChart series={[{ data: statusDistribution }]} height={300} />
        </Box>
      </Stack>

      <Typography variant="h5" gutterBottom>
        Student Directory
      </Typography>

      <Box
        sx={{
          height: 480,
          width: "100%",
          mb: 4,
          borderRadius: "2.25rem",
          overflow: "hidden",
          border: "1px solid #ddd",
        }}
      >
        <DataGrid
          rows={studentRows}
          columns={studentColumns}
          pageSizeOptions={[5, 10]}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Campus Location
      </Typography>

      <Box sx={{ height: 500, width: "100%", borderRadius: 5, overflow: 'hidden'}}>
        <MapContainer
          center={[14.604253, 120.994314]}
          zoom={20}
          style={{ height: "100%", width: "100%"}}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[14.604253, 120.994314]}>
            <Popup>
              <p>
                <i>
                  National University - Manila <br />
                  Sampaloc, Manila, 1008 Metro Manila
                </i>
              </p>
              <p>
                <i>551 F Jhocson St, Sampaloc</i>
              </p>
            </Popup>
          </Marker>
        </MapContainer>
      </Box>
    </>
  );
}

export default DashboardPage;
