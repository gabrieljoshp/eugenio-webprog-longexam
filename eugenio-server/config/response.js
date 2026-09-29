const successResponse = (res, { status = 200, message, data, count, pagination } = {}) => {
  const response = {
    success: true,
    message,
  };

  if (count !== undefined) response.count = count;
  response.data = data;
  if (pagination) response.pagination = pagination;

  return res.status(status).json(response);
};

const errorResponse = (res, { status = 500, message, error } = {}) =>
  res.status(status).json({
    success: false,
    message,
    error: error || null,
  });

module.exports = { successResponse, errorResponse };
