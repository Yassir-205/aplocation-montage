
import { supabase } from '../lib/supabase';

const BUCKET = 'thumbnails';

function formatThumbnail(row) {
  return {
    id: row.id,
    title: row.title,
    dataUri: row.image_url,
    imageUrl: row.image_url,
    imagePath: row.image_path,
    fileName: row.file_name,
    size: row.size,
    createdAt: row.created_at?.split('T')[0] || '',
  };
}

export const thumbnailService = {
  async getAll() {
    const { data, error } = await supabase
      .from('thumbnails')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(formatThumbnail);
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('thumbnails')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data ? formatThumbnail(data) : null;
  },

  async create({ title, file }) {
    if (!file) {
      throw new Error('Please select an image.');
    }

    const allowed = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };

    const extension = allowed[file.type];

    if (!extension) {
      throw new Error('Only JPG, PNG and WEBP are allowed.');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Image must be smaller than 10 MB.');
    }

    const path = `${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    const { data, error } = await supabase
      .from('thumbnails')
      .insert({
        title: title || file.name,
        image_url: urlData.publicUrl,
        image_path: path,
        file_name: file.name,
        size: file.size,
      })
      .select()
      .single();

    if (error) {
      await supabase.storage.from(BUCKET).remove([path]);
      throw error;
    }

    return formatThumbnail(data);
  },

  async delete(id) {
    const item = await this.getById(id);
    if (!item) return true;

    const { error } = await supabase
      .from('thumbnails')
      .delete()
      .eq('id', id);

    if (error) throw error;

    if (item.imagePath) {
      const { error: storageError } = await supabase.storage
        .from(BUCKET)
        .remove([item.imagePath]);

      if (storageError) {
        console.error('Storage cleanup failed:', storageError);
      }
    }

    return true;
  },

  async getStats() {
    const { count, error } = await supabase
      .from('thumbnails')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return { total: count || 0 };
  },
};
