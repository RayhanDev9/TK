const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

// Set FFmpeg and FFprobe binary paths (auto-detect or fallback to known install paths)
const customFfmpegPaths = [
  'D:\\data rayhan\\aplikasi\\ffmpeg\\bin\\ffmpeg.exe',
  'C:\\ffmpeg\\bin\\ffmpeg.exe',
  'C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe'
];

const customFfprobePaths = [
  'D:\\data rayhan\\aplikasi\\ffmpeg\\bin\\ffprobe.exe',
  'C:\\ffmpeg\\bin\\ffprobe.exe',
  'C:\\Program Files\\ffmpeg\\bin\\ffprobe.exe'
];

for (const p of customFfmpegPaths) {
  if (fs.existsSync(p)) {
    ffmpeg.setFfmpegPath(p);
    break;
  }
}

for (const p of customFfprobePaths) {
  if (fs.existsSync(p)) {
    ffmpeg.setFfprobePath(p);
    break;
  }
}

// Configuration
const CONFIG = {
  // Target folder to scan (relative to workspace root or CLI argument)
  targetDir: process.argv[2] || path.join(__dirname, 'asset', 'video'),

  // Supported video extensions
  supportedExtensions: ['.mp4', '.mkv', '.mov', '.avi', '.webm', '.flv'],

  // Video compression settings for Web
  videoCodec: 'libx264',
  audioCodec: 'aac',
  audioBitrate: '128k',
  crf: 28,             // 18-28 (28 is optimal for high web compression with great visual quality)
  preset: 'slow',      // medium, slow, slower (slow offers best compression ratio)
  pixelFormat: 'yuv420p', // standard compatible pixel format for all web browsers
  maxResolutionWidth: 1280 // Max width (720p/HD) for smooth web streaming
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

// Compress a single video file
function compressSingleVideo(inputPath) {
  return new Promise((resolve, reject) => {
    const parsedPath = path.parse(inputPath);
    const tempOutputPath = path.join(parsedPath.dir, `${parsedPath.name}.compressed.temp.mp4`);

    const command = ffmpeg(inputPath)
      .videoCodec(CONFIG.videoCodec)
      .audioCodec(CONFIG.audioCodec)
      .audioBitrate(CONFIG.audioBitrate)
      .outputOptions([
        `-crf ${CONFIG.crf}`,
        `-preset ${CONFIG.preset}`,
        `-pix_fmt ${CONFIG.pixelFormat}`,
        '-movflags +faststart', // Enable fast web playback / progressive download
        `-vf scale='min(${CONFIG.maxResolutionWidth},iw)':-2` // Scale down if wider than max width while keeping aspect ratio
      ])
      .output(tempOutputPath)
      .on('start', (commandLine) => {
        // console.log(`[FFMPEG] Running: ${commandLine}`);
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          process.stdout.write(`\r   > Mengompres: ${progress.percent.toFixed(1)}% selesai`);
        }
      })
      .on('end', () => {
        process.stdout.write('\r                                                     \r');
        resolve(tempOutputPath);
      })
      .on('error', (err) => {
        if (fs.existsSync(tempOutputPath)) {
          try { fs.unlinkSync(tempOutputPath); } catch (e) {}
        }
        reject(err);
      });

    command.run();
  });
}

// Main video processing function
async function processVideos() {
  console.log('='.repeat(65));
  console.log('       PENGOMPRES VIDEO UNTUK WEB (FFMPEG & FLUENT-FFMPEG)');
  console.log('='.repeat(65));
  console.log(` Direktori Target : ${CONFIG.targetDir}`);
  console.log(` Video Codec      : ${CONFIG.videoCodec} (CRF ${CONFIG.crf}, Preset ${CONFIG.preset})`);
  console.log(` Audio Codec      : ${CONFIG.audioCodec} (${CONFIG.audioBitrate})`);
  console.log(` Web Optimization : +faststart, ${CONFIG.pixelFormat}, Max Width ${CONFIG.maxResolutionWidth}px`);
  console.log('='.repeat(65));

  const allFiles = getAllFiles(CONFIG.targetDir);
  const videoFiles = allFiles.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return CONFIG.supportedExtensions.includes(ext) && !file.includes('.compressed.temp.');
  });

  if (videoFiles.length === 0) {
    console.log('\n Tidak ada file video yang ditemukan untuk diproses.\n');
    return;
  }

  console.log(`\n Ditemukan ${videoFiles.length} file video. Memulai proses kompresi...\n`);

  let totalOriginalSize = 0;
  let totalCompressedSize = 0;
  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < videoFiles.length; i++) {
    const filePath = videoFiles[i];
    const relativePath = path.relative(process.cwd(), filePath);
    const originalStats = fs.statSync(filePath);
    const originalSize = originalStats.size;

    console.log(`[${i + 1}/${videoFiles.length}] Memproses: ${relativePath} (${formatBytes(originalSize)})`);

    try {
      const tempOutputPath = await compressSingleVideo(filePath);
      const compressedStats = fs.statSync(tempOutputPath);
      const compressedSize = compressedStats.size;

      if (compressedSize >= originalSize) {
        // If compressed file is not smaller, keep original and delete temp
        fs.unlinkSync(tempOutputPath);
        totalOriginalSize += originalSize;
        totalCompressedSize += originalSize;
        skippedCount++;
        console.log(`   [LEWATI] Video sudah optimal (${formatBytes(originalSize)}).\n`);
      } else {
        // Replace original with compressed file
        fs.unlinkSync(filePath);
        fs.renameSync(tempOutputPath, filePath);

        totalOriginalSize += originalSize;
        totalCompressedSize += compressedSize;
        successCount++;

        const savedBytes = originalSize - compressedSize;
        const savedPercent = ((savedBytes / originalSize) * 100).toFixed(2);

        console.log(
          `   [SUKSES] ${formatBytes(originalSize)} => ${formatBytes(compressedSize)} (${savedPercent}% lebih hemat!)\n`
        );
      }
    } catch (err) {
      errorCount++;
      console.error(`   [GAGAL] ${err.message}\n`);
    }
  }

  // Summary report
  console.log('='.repeat(65));
  console.log('                     RINGKASAN HASIL KOMPRESI VIDEO');
  console.log('='.repeat(65));
  console.log(` Total Video Diproses  : ${videoFiles.length}`);
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
processVideos().catch((err) => {
  console.error('Terjadi kesalahan fatal:', err);
  process.exit(1);
});
