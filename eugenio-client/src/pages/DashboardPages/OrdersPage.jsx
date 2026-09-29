import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { fetchOrders, updateOrder } from "../../services/OrderService";

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
const labelize = (value) =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : "";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const load = async () => {
    try {
      setLoading(true);
      const { data } = await fetchOrders();
      const list = Array.isArray(data)
        ? data
        : data?.data || data?.orders || [];
      setOrders(list.map((order) => ({ ...order, id: order._id || order.id })));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const changeStatus = async (id, status) => {
    try {
      await updateOrder(id, { status });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update order.");
    }
  };
  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const search = searchQuery.toLowerCase();
        return (
          (!search ||
            String(order.orderNumber || "")
              .toLowerCase()
              .includes(search) ||
            String(order.user?.email || "")
              .toLowerCase()
              .includes(search)) &&
          (!statusFilter || order.status === statusFilter)
        );
      }),
    [orders, searchQuery, statusFilter],
  );
  const columns = [
    { field: "orderNumber", headerName: "Order #", minWidth: 150, flex: 0.8 },
    {
      field: "customer",
      headerName: "Customer",
      minWidth: 220,
      flex: 1,
      valueGetter: (_, row) => row.user?.email || "Customer",
    },
    {
      field: "total",
      headerName: "Total",
      minWidth: 120,
      valueFormatter: (value) => `₱${Number(value || 0).toLocaleString()}`,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 140,
      renderCell: ({ row }) => (
        <Chip
          label={labelize(row.status)}
          color={
            row.status === "delivered"
              ? "success"
              : row.status === "cancelled"
                ? "error"
                : "default"
          }
          variant={row.status === "delivered" ? "filled" : "outlined"}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 180,
      sortable: false,
      renderCell: ({ row }) => (
        <TextField
          select
          size="small"
          value={row.status || "pending"}
          onChange={(event) => changeStatus(row.id, event.target.value)}
          sx={{ minWidth: 145 }}
          aria-label={`Update status for ${row.orderNumber}`}
        >
          {statuses.map((status) => (
            <MenuItem key={status} value={status}>
              {labelize(status)}
            </MenuItem>
          ))}
        </TextField>
      ),
    },
  ];
  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Orders Management</Typography>
      </Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by order number or customer email..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          sx={{ mb: 2 }}
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            select
            label="Status"
            size="small"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {labelize(status)}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Paper>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Paper sx={{ p: { xs: 1.5, sm: 2 }, minWidth: 0, overflow: "hidden" }}>
        {loading ? (
          <Alert severity="info">Loading orders...</Alert>
        ) : filteredOrders.length ? (
          <Box sx={{ height: { xs: 460, sm: 520 }, width: "100%" }}>
            <DataGrid
              rows={filteredOrders}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10]}
              initialState={{
                pagination: { paginationModel: { pageSize: 5, page: 0 } },
              }}
              sx={{
                "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus":
                  { outline: "none" },
              }}
            />
          </Box>
        ) : (
          <Alert severity="info">
            {searchQuery || statusFilter
              ? "No orders match your search or filter criteria."
              : "No orders found."}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};
export default OrdersPage;
