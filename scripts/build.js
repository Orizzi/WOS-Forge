#!/usr/bin/env node

/**
 * WOS Calculator - Production Build Script
 * 
 * Automated build pipeline that:
 * - Minifies CSS with source maps
 * - Minifies JavaScript with source maps
 * - Generates cache-busting hashes
 * - Creates production-ready dist/ folder
 * 
 * Usage: npm run build
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { minify: minifyJS } = require('terser');

// ==================== Configuration ====================
const CONFIG = {
  sourceDir: path.join(__dirname, '..', 'src'),
  distDir: path.join(__dirname, '..', 'dist'),
  generateSourceMaps: true,
  cacheBusting: true,
  verbose: true
};

// ==================== Utilities ====================
function log(message, level = 'info') {
  if (!CONFIG.verbose) return;
  const prefix = {
    info: '✓',
    warn: '⚠',
    error: '✗',
    progress: '→'
  }[level] || 'ℹ';
  console.log(`${prefix} ${message}`);
}

function generateHash(content) {
  return crypto.createHash('md5').update(content).digest('hex').slice(0, 8);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`Created directory: ${path.relative(process.cwd(), dir)}`, 'progress');
  }
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  log(`Copied: ${path.relative(CONFIG.sourceDir, src)}`, 'progress');
}

function copyDirectory(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

// ==================== CSS Minification ====================
async function minifyCSS(inputPath, outputPath) {
  log(`Minifying CSS: ${path.basename(inputPath)}`, 'progress');
  
  const css = fs.readFileSync(inputPath, 'utf8');
  
  // Simple CSS minification (remove comments, whitespace, etc.)
  let minified = css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{}:;,])\s*/g, '$1') // Remove whitespace around punctuation
    .replace(/;\}/g, '}') // Remove last semicolon in block
    .trim();
  
  ensureDir(path.dirname(outputPath));
  fs.writeFileSync(outputPath, minified, 'utf8');
  
  const originalSize = Buffer.byteLength(css, 'utf8');
  const minifiedSize = Buffer.byteLength(minified, 'utf8');
  const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
  
  log(`  ${path.basename(inputPath)}: ${originalSize} → ${minifiedSize} bytes (${savings}% reduction)`, 'info');
  
  return minified;
}

// ==================== JavaScript Minification ====================
async function minifyJavaScript(inputPath, outputPath) {
  log(`Minifying JS: ${path.basename(inputPath)}`, 'progress');
  
  const code = fs.readFileSync(inputPath, 'utf8');
  
  try {
    const result = await minifyJS(code, {
      sourceMap: CONFIG.generateSourceMaps ? {
        filename: path.basename(outputPath),
        url: path.basename(outputPath) + '.map'
      } : false,
      compress: {
        dead_code: true,
        drop_console: false, // Keep console.warn/error for debugging
        drop_debugger: true,
        pure_funcs: ['console.log'], // Only remove console.log
        passes: 2
      },
      mangle: {
        toplevel: false, // Don't mangle top-level names (module pattern)
        reserved: ['CalculatorModule', 'ProfilesModule', 'ThemeModule', 'TableSortModule', 'DataLoader', 'I18n', 'IconHelper']
      },
      format: {
        comments: /^!|@preserve|@license|@cc_on/i
      }
    });
    
    ensureDir(path.dirname(outputPath));
    fs.writeFileSync(outputPath, result.code, 'utf8');
    
    if (CONFIG.generateSourceMaps && result.map) {
      fs.writeFileSync(outputPath + '.map', result.map, 'utf8');
      log(`  Generated source map: ${path.basename(outputPath)}.map`, 'info');
    }
    
    const originalSize = Buffer.byteLength(code, 'utf8');
    const minifiedSize = Buffer.byteLength(result.code, 'utf8');
    const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
    
    log(`  ${path.basename(inputPath)}: ${originalSize} → ${minifiedSize} bytes (${savings}% reduction)`, 'info');
    
    return result.code;
  } catch (error) {
    log(`Failed to minify ${path.basename(inputPath)}: ${error.message}`, 'error');
    // Fall back to copying original file
    copyFile(inputPath, outputPath);
    return code;
  }
}

// ==================== HTML Processing ====================
function processHTML(inputPath, outputPath, assetMap) {
  log(`Processing HTML: ${path.basename(inputPath)}`, 'progress');
  
  let html = fs.readFileSync(inputPath, 'utf8');
  
  // Replace asset references with hashed versions
  if (CONFIG.cacheBusting) {
    for (const [original, hashed] of Object.entries(assetMap)) {
      const regex = new RegExp(original.replace(/\./g, '\\.'), 'g');
      html = html.replace(regex, hashed);
    }
  }
  
  ensureDir(path.dirname(outputPath));
  fs.writeFileSync(outputPath, html, 'utf8');
  log(`  Processed: ${path.basename(inputPath)}`, 'info');
}

// ==================== Main Build Process ====================
async function build() {
  console.log('\n🏗️  WOS Calculator - Production Build\n');
  console.log('='.repeat(50));
  
  const startTime = Date.now();
  const assetMap = {}; // Map original paths to hashed paths
  
  try {
    // 1. Clean dist directory
    if (fs.existsSync(CONFIG.distDir)) {
      log('Cleaning dist directory...', 'progress');
      fs.rmSync(CONFIG.distDir, { recursive: true });
    }
    ensureDir(CONFIG.distDir);
    
    // 2. Minify CSS
    log('\n📦 Minifying CSS files...', 'info');
    const cssFiles = [
      'style/style.css'
    ];
    
    for (const cssFile of cssFiles) {
      const inputPath = path.join(CONFIG.sourceDir, cssFile);
      const outputName = path.basename(cssFile, '.css') + '.min.css';
      const outputPath = path.join(CONFIG.distDir, path.dirname(cssFile), outputName);
      
      if (fs.existsSync(inputPath)) {
        const minified = await minifyCSS(inputPath, outputPath);
        
        if (CONFIG.cacheBusting) {
          const hash = generateHash(minified);
          const hashedName = path.basename(cssFile, '.css') + `.${hash}.min.css`;
          const hashedPath = path.join(CONFIG.distDir, path.dirname(cssFile), hashedName);
          fs.renameSync(outputPath, hashedPath);
          assetMap[cssFile] = path.join(path.dirname(cssFile), hashedName).replace(/\\/g, '/');
        }
      }
    }
    
    // 3. Minify JavaScript
    log('\n📦 Minifying JavaScript files...', 'info');
    const scriptsDir = path.join(CONFIG.sourceDir, 'Scripts');
    const jsFiles = fs.readdirSync(scriptsDir)
      .filter(file => file.endsWith('.js') && !file.endsWith('.min.js'));
    
    const distScriptsDir = path.join(CONFIG.distDir, 'Scripts');
    ensureDir(distScriptsDir);
    
    for (const jsFile of jsFiles) {
      const inputPath = path.join(scriptsDir, jsFile);
      const outputName = path.basename(jsFile, '.js') + '.min.js';
      const outputPath = path.join(distScriptsDir, outputName);
      
      const minified = await minifyJavaScript(inputPath, outputPath);
      
      if (CONFIG.cacheBusting) {
        const hash = generateHash(minified);
        const hashedName = path.basename(jsFile, '.js') + `.${hash}.min.js`;
        const hashedPath = path.join(distScriptsDir, hashedName);
        fs.renameSync(outputPath, hashedPath);
        if (fs.existsSync(outputPath + '.map')) {
          fs.renameSync(outputPath + '.map', hashedPath + '.map');
        }
        assetMap[`Scripts/${jsFile}`] = `Scripts/${hashedName}`;
      }
    }
    
    // 4. Copy assets
    log('\n📦 Copying assets...', 'info');
    const assetDirs = ['assets', 'manifest.json', 'service-worker.js'];
    
    for (const asset of assetDirs) {
      const srcPath = path.join(CONFIG.sourceDir, asset);
      const destPath = path.join(CONFIG.distDir, asset);
      
      if (fs.existsSync(srcPath)) {
        const stat = fs.statSync(srcPath);
        if (stat.isDirectory()) {
          copyDirectory(srcPath, destPath);
        } else {
          copyFile(srcPath, destPath);
        }
      }
    }
    
    // 5. Process HTML files
    log('\n📦 Processing HTML files...', 'info');
    const htmlFiles = fs.readdirSync(CONFIG.sourceDir)
      .filter(file => file.endsWith('.html'));
    
    for (const htmlFile of htmlFiles) {
      const inputPath = path.join(CONFIG.sourceDir, htmlFile);
      const outputPath = path.join(CONFIG.distDir, htmlFile);
      processHTML(inputPath, outputPath, assetMap);
    }
    
    // 6. Copy root files
    log('\n📦 Copying root configuration files...', 'info');
    const rootFiles = ['CNAME', 'netlify.toml'];
    for (const file of rootFiles) {
      const srcPath = path.join(__dirname, '..', file);
      const destPath = path.join(CONFIG.distDir, file);
      if (fs.existsSync(srcPath)) {
        copyFile(srcPath, destPath);
      }
    }
    
    // 7. Build summary
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(50));
    log(`✅ Build completed successfully in ${duration}s`, 'info');
    log(`📁 Output: ${path.relative(process.cwd(), CONFIG.distDir)}`, 'info');
    
    if (CONFIG.cacheBusting) {
      log('\n🔑 Cache-busting hashes applied to:', 'info');
      for (const [original, hashed] of Object.entries(assetMap)) {
        log(`  ${original} → ${hashed}`, 'progress');
      }
    }
    
    console.log('\n🚀 Ready for deployment!\n');
    
  } catch (error) {
    log(`Build failed: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  }
}

// ==================== Run Build ====================
if (require.main === module) {
  build().catch(error => {
    console.error('Build error:', error);
    process.exit(1);
  });
}

module.exports = { build };
