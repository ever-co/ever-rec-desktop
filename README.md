# Ever Rec Desktop

## Overview

**Ever Rec Desktop** is a cutting-edge desktop application designed to seamlessly capture screens and transform continuous screenshots into a unified, high-quality video. Built with Electron and Angular, it empowers users to create tutorials, record gameplay, monitor workflows, and much more with efficiency and ease. The application operates unobtrusively, allowing users to focus on their tasks while it manages screen recording in the background.

It's a part of **Ever® Rec™ - Open Screen Capture, Screen Recording, Images & Video Sharing Platform**.  
Please check our official website <https://rec.so> and GitHub repository <https://github.com/ever-co/ever-rec> for more information.

## Features

- **Continuous Screen Capture**: Automatically captures high-resolution screenshots at user-defined intervals, ensuring every critical moment is preserved.
- **Video Compilation**: Converts sequences of screenshots into smooth, high-quality video files with just a few clicks.
- **Secure Video Upload**: Enables users to directly upload the generated videos to an S3 bucket for secure storage and easy sharing.
- **Customizable Settings**:
  - Configure capture intervals to suit your workflow (e.g., every second, every minute).
  - Select video resolutions (e.g., 720p, 1080p) and output formats.
- **Resource Efficiency**: Optimized for minimal impact on system performance and resource usage, ensuring smooth operation even during intensive tasks.
- **Intuitive Interface**: Offers a clean and user-friendly interface for starting, stopping, and configuring screen capture sessions.
- **Cross-Platform Compatibility**: Fully compatible with Windows, macOS, and Linux environments.

## Usage

### 1. Start Recording

- Launch the application and press the **Start Capturing** button to begin screen recording.
- Screenshots will be captured continuously at the configured intervals.

### 2. Stop Recording

- Press the **Stop Capturing** button to end the recording session.
- The application will automatically compile the captured screenshots into a video file.

### 3. Configure Settings

- Access the settings menu to adjust the capture interval (e.g., 1 second, 10 seconds).
- Select the desired video resolution (e.g., 720p, 1080p).
- Configure S3 bucket details for direct video upload.

## Development

### Prerequisites

- Ensure **Node.js** and **npm** are installed on your system.
- Confirm that your development environment supports **NX** for build processes.

### Build Commands

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Build the project:

   ```bash
   yarn run build
   ```

3. Create a desktop application build:

   ```bash
   yarn run make
   ```

### Publishing to a Private NPM Registry

#### Step 1: Configure npm

1. Set npm to use your private registry:

   ```bash
   npm set registry https://your-private-registry.com
   npm adduser --registry https://your-private-registry.com
   npm set scope=@your-org
   ```

2. Provide your credentials (username, password, email).

#### Step 2: Publish a Package

1. Publish an individual package:

   ```bash
   nx run lib-name:publish
   ```

2. Verify the package appears in your private registry.

#### Step 3: Publish All Packages (Optional)

1. Publish all packages or affected libraries:

   ```bash
   yarn run publish:all or yarn run publish:affected:libraries
   ```

2. Verify all packages are listed in your private registry.

## License

This project is licensed under the GPLv3 License.  
For more information, please see the [LICENSE](LICENSE).

---

Enjoy effortless screen recording with Ever® Rec™! 🎥
