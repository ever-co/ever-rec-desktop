export const resolutionMapper: Record<string, string> = {
  '640:360': '360p',
  '720:480': '480p',
  '1280:720': '720p',
  '1920:1080': '1080p',
  '2560:1440': '1440p',
  '3840:2160': '4K',
  '5120:2880': '5K',
  '6144:3160': '6K',
  '7680:4320': '8K',
  '2048:1080': '2K (DCI)',
  '4096:2160': '4K (DCI)',
};

export const iconMapper: Record<string, string> = {
  '360p': '360', // Use a generic "360" icon
  '480p': 'sd', // Standard definition
  '720p': 'hd', // High definition
  '1080p': 'hd', // High definition
  '1440p': 'high_quality', // Represents high quality
  '4K': '4k', // 4K icon
  '5K': 'high_quality', // Custom use, similar to high quality
  '6K': 'high_quality', // Custom use, similar to high quality
  '8K': '8k', // 8K icon
  '2K (DCI)': 'high_quality', // Custom icon for DCI standards
  '4K (DCI)': '4k', // Custom icon for DCI 4K
};
