// Helper to extract title, description, thumbnail from plain text content and mediaUrls
// Usage: const { title, description, thumbnailUrl } = extractPostMeta(content, mediaUrls)

export function extractPostMeta(content: string, mediaUrls?: string[]) {
  // 1. Title: lấy câu đầu tiên của dòng đầu (ngắt tại dấu chấm hỏi/chấm than/chấm)
  const lines = (content || "").split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const firstLine = lines[0] || "(Không có tiêu đề)";
  // tìm vị trí dấu chấm, hỏi, than đầu tiên
  const firstPunctIdx = firstLine.search(/[.?!]/);
  const title =
    firstPunctIdx !== -1
      ? firstLine.slice(0, firstPunctIdx).trim() || firstLine
      : firstLine;

  // 2. Description: 100 từ đầu tiên sau dòng đầu tiên
  const rest = lines.slice(1).join(" ");
  const words = rest.split(/\s+/).filter(Boolean);
  const description = words.slice(0, 100).join(" ");

  // 3. Thumbnail: ảnh đầu tiên trong mediaUrls (nếu có)
  const thumbnailUrl = mediaUrls && mediaUrls.length > 0 ? mediaUrls[0] : undefined;

  return { title, description, thumbnailUrl };
}
