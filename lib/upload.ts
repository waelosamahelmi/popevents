import { uploadFile as supabaseUploadFile, deleteFile } from './supabase';

// Generate unique filename
export function generateFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const ext = originalName.split('.').pop();
  return `${timestamp}-${random}.${ext}`;
}

// Simple upload function for the API route
export async function uploadFile(file: File, folder: string): Promise<string> {
  const filename = generateFilename(file.name);
  return supabaseUploadFile(folder, filename, file, file.type);
}

// Upload event cover image
export async function uploadEventImage(file: File): Promise<string> {
  const filename = generateFilename(file.name);
  return supabaseUploadFile('events', filename, file, file.type);
}

// Upload portfolio images
export async function uploadPortfolioImages(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(async (file) => {
    const filename = generateFilename(file.name);
    return supabaseUploadFile('portfolio', filename, file, file.type);
  });
  return Promise.all(uploadPromises);
}

// Upload registration document (license/permit)
export async function uploadRegistrationFile(file: File): Promise<string> {
  const filename = generateFilename(file.name);
  return supabaseUploadFile('registrations', filename, file, file.type);
}

// Upload site branding image
export async function uploadSiteImage(file: File, type: 'logo' | 'hero'): Promise<string> {
  const filename = generateFilename(file.name);
  return supabaseUploadFile('site', `${type}/${filename}`, file, file.type);
}

// Delete file from Supabase
export async function deleteSupabaseFile(url: string, bucket: string): Promise<void> {
  try {
    // Extract path from URL
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/);
    if (pathMatch && pathMatch[1]) {
      await deleteFile(bucket, pathMatch[1]);
    }
  } catch (error) {
    console.error('Failed to delete file:', error);
    // Don't throw error, as the file might not exist
  }
}
