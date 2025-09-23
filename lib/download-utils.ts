// Utility functions for downloading icons

export const downloadSVG = (svgCode: string, fileName: string) => {
  // Ensure the SVG has proper dimensions and viewBox for 500x500px canvas
  let processedSvg = svgCode;
  
  // Check if the SVG already has proper dimensions
  if (!svgCode.includes('width="500"') || !svgCode.includes('height="500"')) {
    // If it's a complete SVG, modify its dimensions
    if (svgCode.includes('<svg')) {
      // Replace existing width and height attributes, or add them
      processedSvg = svgCode
        .replace(/width="[^"]*"/g, 'width="500"')
        .replace(/height="[^"]*"/g, 'height="500"');
      
      // If no width/height attributes existed, add them
      if (!processedSvg.includes('width="500"')) {
        processedSvg = processedSvg.replace('<svg', '<svg width="500" height="500"');
      }
      
      // Ensure proper viewBox for scaling
      if (!processedSvg.includes('viewBox=')) {
        processedSvg = processedSvg.replace('<svg', '<svg viewBox="0 0 500 500"');
      } else {
        // Update existing viewBox to 500x500
        processedSvg = processedSvg.replace(/viewBox="[^"]*"/g, 'viewBox="0 0 500 500"');
      }
    } else {
      // If it's just SVG content without the wrapper, wrap it in a 500x500 SVG
      processedSvg = `<svg width="500" height="500" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  ${svgCode}
</svg>`;
    }
  }
  
  // Create a blob with the processed SVG content
  const blob = new Blob([processedSvg], { type: 'image/svg+xml' });
  
  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor element and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.endsWith('.svg') ? fileName : `${fileName}.svg`;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the temporary URL
  URL.revokeObjectURL(url);
};

export const downloadImageFromBase64 = (base64Url: string, fileName: string) => {
  // Create a temporary anchor element and trigger download
  const link = document.createElement('a');
  link.href = base64Url;
  link.download = fileName;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadImageFromUrl = async (imageUrl: string, fileName: string) => {
  try {
    // If it's a data URL, use direct download
    if (imageUrl.startsWith('data:')) {
      downloadImageFromBase64(imageUrl, fileName);
      return;
    }
    
    // For external URLs, fetch and create blob
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // Create temporary URL and download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error('Failed to download image');
  }
};

// Download PNG image directly from URL or base64 data
export const downloadPNGImage = async (imageUrl: string, fileName: string) => {
  try {
    // Ensure the filename has .png extension
    const pngFileName = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
    
    // If it's a data URL, use direct download
    if (imageUrl.startsWith('data:')) {
      downloadImageFromBase64(imageUrl, pngFileName);
      return;
    }
    
    // For external URLs, fetch and create blob
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // Create temporary URL and download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = pngFileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PNG image:', error);
    throw new Error('Failed to download PNG image');
  }
};

// Convert SVG to different image formats
export const svgToCanvas = (svgCode: string, width: number = 500, height: number = 500): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }
    
    canvas.width = width;
    canvas.height = height;
    
    // Create an image from the SVG
    const img = new Image();
    const svgBlob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      // Fill with white background for non-transparent formats
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      
      // Draw the SVG image
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG image'));
    };
    
    img.src = url;
  });
};

export const downloadSVGAsFormat = async (svgCode: string, fileName: string, format: 'svg' | 'png' | 'jpg') => {
  try {
    if (format === 'svg') {
      downloadSVG(svgCode, fileName);
      return;
    }
    
    // Convert SVG to canvas for raster formats
    const canvas = await svgToCanvas(svgCode);
    
    // Convert canvas to blob
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = format === 'jpg' ? 0.9 : undefined;
    
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create blob from canvas');
      }
      
      // Download the blob
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = generateFileName(fileName.replace(/\.[^/.]+$/, ''), format);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    }, mimeType, quality);
    
  } catch (error) {
    console.error('Error converting SVG:', error);
    throw new Error(`Failed to download as ${format.toUpperCase()}`);
  }
};

export const generateFileName = (name: string, format: string = 'svg'): string => {
  // Clean the name to be filesystem-safe
  const cleanName = name
    .replace(/[^a-zA-Z0-9\s-_]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .toLowerCase();
  
  return `${cleanName}.${format.toLowerCase()}`;
};
