import { createClient } from "@supabase/supabase-js";
import path from "path";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// 🔧 generate file path
const generateFilePath = (folder, userId, file) => {
  const ext = path.extname(file.originalname); // .jpg
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);

  return `${folder}/${userId}/${timestamp}-${random}${ext}`;
};

// 🚀 main upload function
export const uploadImage = async (folder, userId, file) => {
  console.log("📤 [UPLOAD] Start", { folder, userId });

  const bucketName = "my-personal-blog";
  const filePath = generateFilePath(folder, userId, file);

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error("💥 [UPLOAD] Error", { message: error.message });
      throw new Error(error.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(data.path);

    console.log("✅ [UPLOAD] Success", { filePath });

    return publicUrl;

  } catch (error) {
    console.error("💥 [UPLOAD] Failed", {
      message: error.message,
    });
    throw error;
  }
};