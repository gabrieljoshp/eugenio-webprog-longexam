import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { fetchReviews, updateReview } from "../../services/ReviewService";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [comment, setComment] = useState("");
  const load = async () => {
    try {
      setLoading(true);
      const { data } = await fetchReviews();
      const list = Array.isArray(data)
        ? data
        : data?.data || data?.reviews || [];
      setReviews(
        list.map((review) => ({ ...review, id: review._id || review.id })),
      );
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const saveEdit = async () => {
    if (!comment.trim() || !editingReview) return;
    try {
      await updateReview(editingReview.id, { comment: comment.trim() });
      setEditingReview(null);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update review.");
    }
  };
  const filteredReviews = useMemo(
    () =>
      reviews.filter((review) => {
        const search = searchQuery.toLowerCase();
        return (
          (!search ||
            [
              review.product?.productName,
              review.user?.email,
              review.title,
              review.comment,
            ].some((value) =>
              String(value || "")
                .toLowerCase()
                .includes(search),
            )) &&
          (!ratingFilter || String(review.rating) === ratingFilter)
        );
      }),
    [reviews, searchQuery, ratingFilter],
  );
  const columns = [
    {
      field: "product",
      headerName: "Product",
      minWidth: 180,
      flex: 1,
      valueGetter: (_, row) => row.product?.productName || "Product",
    },
    {
      field: "customer",
      headerName: "Customer",
      minWidth: 200,
      flex: 1,
      valueGetter: (_, row) => row.user?.email || "Customer",
    },
    {
      field: "rating",
      headerName: "Rating",
      minWidth: 120,
      renderCell: ({ row }) =>
        `${"★".repeat(row.rating || 0)} (${row.rating || 0})`,
    },
    { field: "title", headerName: "Title", minWidth: 180, flex: 1 },
    { field: "comment", headerName: "Comment", minWidth: 250, flex: 1.5 },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 110,
      sortable: false,
      renderCell: ({ row }) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setEditingReview(row);
            setComment(row.comment || "");
          }}
        >
          Edit
        </Button>
      ),
    },
  ];
  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Reviews Management</Typography>
      </Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by product, customer, title, or comment..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          sx={{ mb: 2 }}
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            select
            label="Rating"
            size="small"
            value={ratingFilter}
            onChange={(event) => setRatingFilter(event.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All Ratings</MenuItem>
            {[5, 4, 3, 2, 1].map((rating) => (
              <MenuItem key={rating} value={String(rating)}>
                {rating} star{rating > 1 ? "s" : ""}
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
          <Alert severity="info">Loading reviews...</Alert>
        ) : filteredReviews.length ? (
          <Box sx={{ height: { xs: 460, sm: 520 }, width: "100%" }}>
            <DataGrid
              rows={filteredReviews}
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
            {searchQuery || ratingFilter
              ? "No reviews match your search or filter criteria."
              : "No reviews found."}
          </Alert>
        )}
      </Paper>
      <Dialog
        open={Boolean(editingReview)}
        onClose={() => setEditingReview(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={4}
            label="Comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setEditingReview(null)}>Cancel</Button>
          <Button variant="contained" onClick={saveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default ReviewsPage;
