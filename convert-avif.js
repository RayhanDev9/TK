const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const CONFIG = {
  // Target folder to scan (relative to workspace root)
  targetDir: process.argv[2] || path.join(__dirname, 'asset', 'img'),
  
  // Supported image extensions to convert/compress
  supportedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tiff', '.bmp'],
  
  // Sharp AVIF options
  avifOptions: {
    quality: 75, // Quality setting (1-100), 75 gives excellent visual fidelity & compression
    effort: 6,   // CPU effort (0-9), higher = smaller file size, slower encode
    chromaSubsampling: '4:2:0'
  },

  // Delete source file after converting to .avif (if source wasn't .avif)
  // Set to false to keep original files alongside .avif files
  deleteOriginalIfConverted: false
};

// Helper: Format bytes to human readable string
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

// Helper: Recursively get all files in directory
function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

// Main compression function
async function processImages() {
  console.log('='.repeat(65));
  console.log('       PENGOMPRES & KONVERSI GAMBAR KE FORMAT AVIF (SHARP)');
  console.log('='.repeat(65));
  console.log(` Direktori Target : ${CONFIG.targetDir}`);
  console.log(` Kualitas AVIF    : ${CONFIG.avifOptions.quality}`);
  console.log(` Effort CPU       : ${CONFIG.avifOptions.effort}`);
  console.log('='.repeat(65));

  const allFiles = getAllFiles(CONFIG.targetDir);
  const imageFiles = allFiles.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return CONFIG.supportedExtensions.includes(ext);
  });

  if (imageFiles.length === 0) {
    console.log('\n Tidak ada file gambar yang ditemukan untuk diproses.\n');
    return;
  }

  console.log(`\n Ditemukan ${imageFiles.length} file gambar. Memulai proses kompresi...\n`);

  let totalOriginalSize = 0;
  let totalCompressedSize = 0;
  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  const results = [];

  for (const filePath of imageFiles) {
    const relativePath = path.relative(process.cwd(), filePath);
    const originalStats = fs.statSync(filePath);
    const originalSize = originalStats.size;
    const ext = path.extname(filePath).toLowerCase();
    const isAvif = ext === '.avif';
    const outputFilePath = isAvif
      ? filePath
      : path.join(path.dirname(filePath), `${path.parse(filePath).name}.avif`);

    try {
      const imageInstance = sharp(filePath);
      const metadata = await imageInstance.metadata();

      // Compress to AVIF buffer
      const compressedBuffer = await sharp(filePath)
        .avif(CONFIG.avifOptions)
        .toBuffer();

      const newSize = compressedBuffer.length;

      // Check if saving is beneficial
      if (isAvif && newSize >= originalSize) {
        // If already AVIF and new compression doesn't reduce size, keep original
        totalOriginalSize += originalSize;
        totalCompressedSize += originalSize;
        skippedCount++;
        results.push({
          file: relativePath,
          dimension: `${metadata.width || '?'}x${metadata.height || '?'}`,
          originalSize,
          newSize: originalSize,
          savedBytes: 0,
          savedPercent: '0.00%',
          status: 'Sudah Optimal'
        });
        console.log(` [LEWATI] ${relativePath} (Sudah optimal)`);
        continue;
      }

      // Write compressed AVIF
      // If overwriting existing file, use temporary write or direct buffer write
      fs.writeFileSync(outputFilePath, compressedBuffer);

      // If source wasn't avif and deleteOriginalIfConverted is true, remove original
      if (!isAvif && CONFIG.deleteOriginalIfConverted && outputFilePath !== filePath) {
        fs.unlinkSync(filePath);
      }

      totalOriginalSize += originalSize;
      totalCompressedSize += newSize;
      successCount++;

      const savedBytes = originalSize - newSize;
      const savedPercent = ((savedBytes / originalSize) * 100).toFixed(2);

      results.push({
        file: relativePath,
        dimension: `${metadata.width || '?'}x${metadata.height || '?'}`,
        originalSize,
        newSize,
        savedBytes,
        savedPercent: `${savedPercent}%`,
        status: isAvif ? 'Dikpres' : 'Dikonversi & Dikompres'
      });

      console.log(
        ` [OK] ${relativePath} -> ${formatBytes(originalSize)} => ${formatBytes(newSize)} (${savedPercent}% lebih hemat)`
      );
    } catch (err) {
      errorCount++;
      console.error(` [GAGAL] ${relativePath}: ${err.message}`);
    }
  }

  // Summary report
  console.log('\n' + '='.repeat(65));
  console.log('                     RINGKASAN HASIL');
  console.log('='.repeat(65));
  console.log(` Total Gambar Diproses : ${imageFiles.length}`);
  console.log(` Berhasil Dikompres    : ${successCount}`);
  console.log(` Dilewati (Optimal)    : ${skippedCount}`);
  console.log(` Gagal                 : ${errorCount}`);
  console.log('-'.repeat(65));
  console.log(` Ukuran Total Awal     : ${formatBytes(totalOriginalSize)}`);
  console.log(` Ukuran Total Akhir    : ${formatBytes(totalCompressedSize)}`);
  
  const totalSaved = totalOriginalSize - totalCompressedSize;
  const totalSavedPercent = totalOriginalSize > 0 ? ((totalSaved / totalOriginalSize) * 100).toFixed(2) : '0.00';
  console.log(` Total Ruang Dihemat   : ${formatBytes(totalSaved)} (${totalSavedPercent}%)`);
  console.log('='.repeat(65) + '\n');
}

// Execute
processImages().catch((err) => {
  console.error('Terjadi kesalahan fatal:', err);
  process.exit(1);
});
