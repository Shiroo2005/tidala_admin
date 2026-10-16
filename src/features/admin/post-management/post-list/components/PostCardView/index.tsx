import type { Post } from "@/shared/types/post.type";
import { Box, MenuItem, Pagination, Select, Typography } from "@mui/material";
import { PostItemCard } from "./PostItemCard";

interface PostCardViewProps {
  posts: Post[];
  page: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (size: number) => void;
  onDelete?: (post: Post) => void;
}

export const PostCardView = ({
  posts,
  page,
  totalPages,
  rowsPerPage,
  onRowsPerPageChange,
  onPageChange,
  onDelete,
}: PostCardViewProps) => {
  return (
    <div className="flex flex-col gap-4">
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200/60 shadow-sm mt-2">
          <svg
            className="w-16 h-16 mb-4 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <p className="text-base font-medium">Chưa có bài đăng nào</p>
          <p className="text-sm mt-1">Dữ liệu bài đăng sẽ hiển thị tại đây</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <PostItemCard key={post.id} post={post} onDelete={onDelete} />
          ))}
        </div>
      )}

      {posts.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            flexWrap: "wrap",
            gap: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            mt: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Số dòng/trang:
            </Typography>
            <Select
              size="small"
              value={rowsPerPage}
              onChange={(e) => {
                onRowsPerPageChange(Number(e.target.value));
              }}
              sx={{ height: 32 }}
            >
              {[5, 10, 20, 50, 100].map((sizeOption) => (
                <MenuItem key={sizeOption} value={sizeOption}>
                  {sizeOption}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => onPageChange(newPage)}
            color="primary"
          />
        </Box>
      )}
    </div>
  );
};
