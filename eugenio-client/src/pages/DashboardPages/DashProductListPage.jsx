import { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Snackbar,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/ProductService";
import { fetchCategories } from "../../services/CategoryService";

const blankForm = {
  productName: "",
  slug: "",
  description: "",
  category: "",
  price: 0,
  stock: 0,
  images: [],
};

const DashProductListPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ open: false, id: null });
  const [form, setForm] = useState(blankForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    loadProductsFromAPI();
    loadCategoriesFromAPI();
  }, []);

  const loadCategoriesFromAPI = async () => {
    try {
      const { data } = await fetchCategories();
      const list = Array.isArray(data) ? data : data.data || [];
      setCategories(list.filter((category) => category.isActive !== false));
    } catch (err) {
      console.error("Error loading categories:", err);
      setError("Failed to load categories.");
    }
  };

  const loadProductsFromAPI = async () => {
    try {
      setLoading(true);
      const { data } = await fetchProducts();
      const list = Array.isArray(data)
        ? data
        : data.data || data.products || data.articles || [];

      setProducts(
        list.map((item, index) => {
          const category = item.category;
          const categoryName =
            typeof category === "object" && category !== null
              ? category.name || category.slug || "Uncategorized"
              : category || "Uncategorized";

          return {
            ...item,
            id: item._id || item.id || index,
            productName: item.productName || item.name || item.title || "",
            productTitle: item.title || item.description || item.content || "",
            slug: item.slug || item.name || item.productName || "",
            description: item.description || item.content || "",
            // Keep the ID for editing, but use categoryName for display and search.
            category:
              typeof category === "object" && category !== null
                ? category._id || ""
                : category || "",
            categoryName,
          };
        }),
      );
      setError(null);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (product.productName || product.slug)
        ?.toLowerCase()
        .includes(searchLower) ||
      (product.description || "").toLowerCase().includes(searchLower) ||
      (product.productTitle || "").toLowerCase().includes(searchLower) ||
      (product.categoryName || "").toLowerCase().includes(searchLower)
    );
  });

  const openModal = (product) => {
    setModal({ open: true, id: product ? product.id : null });
    setForm(product ? { ...blankForm, ...product } : { ...blankForm });
    setImageFile(null);
    setImagePreview(product?.images?.[0] || "");
    setErrors({});
  };

  const closeModal = () => {
    setModal({ open: false, id: null });
    setForm(blankForm);
    setImageFile(null);
    setImagePreview("");
  };

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.productName.trim())
      nextErrors.productName = "Product name is required.";
    if (!form.slug.trim()) nextErrors.slug = "Slug is required.";
    if (!form.description.trim())
      nextErrors.description = "Description is required.";
    if (!form.category) nextErrors.category = "Category is required.";
    if (!modal.id && !imageFile && !form.images?.length) {
      nextErrors.image = "An image is required when creating a product.";
    }
    return nextErrors;
  };

  const handleImageChange = ({ target: { files } }) => {
    const file = files?.[0];
    if (!file) return;
    if (
      !file.type.startsWith("image/") ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    ) {
      setErrors((current) => ({
        ...current,
        image: "Choose a JPEG, PNG, or WebP image.",
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((current) => ({
        ...current,
        image: "Image must not exceed 5 MB.",
      }));
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((current) => ({ ...current, image: "" }));
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
        await updateProduct(modal.id, form, imageFile);
      } else {
        await createProduct(form, imageFile);
      }
      await loadProductsFromAPI();
      closeModal();
      setSnackbar({
        open: true,
        message: `Product ${modal.id ? "updated" : "created"} successfully!`,
        severity: "success",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await deleteProduct(id);
      await loadProductsFromAPI();
      setSnackbar({
        open: true,
        message: "Product deleted successfully!",
        severity: "success",
      });
    } catch {
      setError("Failed to delete product.");
    }
  };

  const columns = [
    {
      field: "productName",
      headerName: "Product Name",
      flex: 0.8,
      minWidth: 150,
    },
    {
      field: "productTitle",
      headerName: "Product Title",
      flex: 1.2,
      minWidth: 220,
    },
    { field: "categoryName", headerName: "Category", flex: 0.7, minWidth: 120 },
    { field: "price", headerName: "Price", flex: 0.5, minWidth: 100 },
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
        <Typography variant="h4">Product Management</Typography>
        <Button variant="contained" onClick={() => openModal()}>
          Create Product
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search products by name, title, or category..."
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
          <Alert severity="info">Loading products...</Alert>
        ) : (
          <Box sx={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={filteredProducts}
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
            {modal.id ? "Edit Product" : "Create Product"}
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                name="productName"
                label="Product name"
                value={form.productName}
                onChange={handleChange}
                error={Boolean(errors.productName)}
                helperText={errors.productName}
                fullWidth
              />
              <TextField
                name="slug"
                label="Slug"
                value={form.slug}
                onChange={handleChange}
                error={Boolean(errors.slug)}
                helperText={errors.slug}
                fullWidth
              />
              <FormControl fullWidth error={Boolean(errors.category)}>
                <InputLabel id="product-category-label">Category</InputLabel>
                <Select
                  labelId="product-category-label"
                  name="category"
                  value={form.category}
                  label="Category"
                  onChange={handleChange}
                >
                  <MenuItem value="" disabled>
                    Select a category
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <FormHelperText>{errors.category}</FormHelperText>
                )}
              </FormControl>
              <TextField
                name="price"
                label="Price"
                value={form.price}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="stock"
                label="Stock"
                value={form.stock}
                onChange={handleChange}
                fullWidth
              />
              <Box>
                <Button component="label" variant="outlined">
                  Choose product image
                  <input
                    hidden
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                  />
                </Button>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 1, ml: 1 }}
                >
                  JPEG, PNG, or WebP up to 5 MB
                </Typography>
                {errors.image && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.image}
                  </Alert>
                )}
                {imagePreview && (
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Product preview"
                    sx={{
                      mt: 2,
                      width: 180,
                      height: 180,
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                )}
              </Box>
              <TextField
                name="description"
                label="Description"
                value={form.description}
                onChange={handleChange}
                error={Boolean(errors.description)}
                helperText={errors.description}
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

export default DashProductListPage;
