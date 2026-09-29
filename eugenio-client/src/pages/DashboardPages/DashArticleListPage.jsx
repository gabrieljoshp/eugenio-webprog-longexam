import { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
  Snackbar,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import {
  fetchArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../../services/ArticleService";

const blankForm = {
  name: "",
  title: "",
  image: "/assets/placeholder.jpg",
  content: "",
};

const DashArticleListPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ open: false, id: null });
  const [form, setForm] = useState(blankForm);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    loadArticlesFromAPI();
  }, []);

  const loadArticlesFromAPI = async () => {
    try {
      setLoading(true);
      const { data } = await fetchArticles();
      // If backend returns a direct array or { articles: [] }
      const list = Array.isArray(data) ? data : data.articles || [];

      setArticles(
        list.map((item, index) => ({
          id: item._id || index, // Use index if ID is missing from hardcoded data
          ...item,
        })),
      );
      setError(null);
    } catch (err) {
      console.error("Error loading articles:", err);
      setError("Failed to load articles.");
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter((article) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      article.name.toLowerCase().includes(searchLower) ||
      article.title.toLowerCase().includes(searchLower)
    );
  });

  const openModal = (article) => {
    setModal({ open: true, id: article ? article.id : null });
    setForm(article ? { ...blankForm, ...article } : { ...blankForm });
    setErrors({});
  };

  const closeModal = () => {
    setModal({ open: false, id: null });
    setForm(blankForm);
  };

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.title.trim()) nextErrors.title = "Title is required.";
    if (!form.content.trim()) nextErrors.content = "Content is required.";
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    try {
      if (modal.id && typeof modal.id === "string") {
        await updateArticle(modal.id, form);
      } else {
        await createArticle(form);
      }
      await loadArticlesFromAPI();
      closeModal();
      setSnackbar({
        open: true,
        message: `Article ${modal.id ? "updated" : "created"} successfully!`,
        severity: "success",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save article.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?"))
      return;
    try {
      await deleteArticle(id);
      await loadArticlesFromAPI();
      setSnackbar({
        open: true,
        message: "Article deleted successfully!",
        severity: "success",
      });
    } catch (err) {
      setError("Failed to delete article.");
    }
  };

  const columns = [
    { field: "name", headerName: "Category/Name", flex: 0.8, minWidth: 150 },
    { field: "title", headerName: "Headline Title", flex: 1.2, minWidth: 250 },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 180,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1} sx={{ py: 0.5 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => openModal(row)}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
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
        <Typography variant="h4">Article Management</Typography>
        <Button variant="contained" onClick={() => openModal()}>
          Create Article
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search articles by name or title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
        />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Alert severity="info">Loading articles...</Alert>
        ) : (
          <Box sx={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={filteredArticles}
              columns={columns}
              pageSizeOptions={[5, 10]}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
            />
          </Box>
        )}
      </Paper>

      <Dialog
        open={modal.open}
        onClose={closeModal}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>
            {modal.id ? "Edit Article" : "Create Article"}
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                name="name"
                label="Article Name / Category"
                value={form.name}
                onChange={handleChange}
                error={Boolean(errors.name)}
                helperText={errors.name}
                fullWidth
              />
              <TextField
                name="title"
                label="Headline Title"
                value={form.title}
                onChange={handleChange}
                error={Boolean(errors.title)}
                helperText={errors.title}
                fullWidth
              />
              <TextField
                name="image"
                label="Image Path (e.g., /assets/filename.jpg)"
                value={form.image}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="content"
                label="Content"
                value={
                  typeof form.content === "string"
                    ? form.content
                    : form.content[0]
                }
                onChange={handleChange}
                error={Boolean(errors.content)}
                helperText={errors.content}
                multiline
                rows={6}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="submit" variant="contained">
              {modal.id ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashArticleListPage;
