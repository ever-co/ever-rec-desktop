# Ever Rec Desktop

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/ever-co/ever-rec-desktop)
[![Gitter](https://badges.gitter.im/JoinChat.svg)](https://gitter.im/ever-co/ever-rec-desktop?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/evereq?utm_source=github&utm_medium=button&utm_term=evereq&utm_campaign=github)

## 🌟 What is it

**Ever® Rec™ Desktop** is a cutting-edge desktop application designed to seamlessly capture screens and transform continuous screenshots into a unified, high-quality video. Built with Electron and Angular, it empowers users to create tutorials, record gameplay, monitor workflows, and much more with efficiency and ease. The application operates unobtrusively, allowing users to focus on their tasks while it manages screen recording in the background.

It's a part of **Ever® Rec™ - Open Screen Capture, Screen Recording, Images & Video Sharing Platform**.  
Please check our official website <https://rec.so> and GitHub repository <https://github.com/ever-co/ever-rec> for more information.

## ✨ Features

- **Continuous Screen Capture**: Automatically captures high-resolution screenshots at user-defined intervals, ensuring every critical moment is preserved.
- **Video Compilation**: Converts sequences of screenshots into smooth, high-quality video files with just a few clicks.
- **Secure Video Upload**: Enables users to directly upload the generated videos to an S3 bucket for secure storage and easy sharing.
- **Customizable Settings**:
  - Configure capture intervals to suit your workflow (e.g., every second, every minute).
  - Select video resolutions (e.g., 720p, 1080p) and output formats.
- **Resource Efficiency**: Optimized for minimal impact on system performance and resource usage, ensuring smooth operation even during intensive tasks.
- **Intuitive Interface**: Offers a clean and user-friendly interface for starting, stopping, and configuring screen capture sessions.
- **Cross-Platform Compatibility**: Fully compatible with Windows, macOS, and Linux environments.

## 🌼 Screenshots

<details>
<summary>Show / Hide Screenshots</summary>

TODO

</details>

## 🔗 Links

- **<https://rec.so>** - official website
- **<https://github.com/ever-co/ever-rec>** - Platform Mono-Repo
- **<https://app.rec.so>** - SaaS Platform (WIP)
- **<https://ever.co>** - get more information about our company products.

## 📊 Activity

![Alt](https://repobeats.axiom.co/api/embed/bab1e3591d76a1a346dfda363ccb315dbd1d58fa.svg "Repobeats analytics image")

## 📑 Usage

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

## 💌 Contact Us

-   [Ever.co Website Contact Us page](https://ever.co/contacts)
-   [Slack Community](https://join.slack.com/t/gauzy/shared_invite/enQtNzc5MTA5MDUwODg2LTI0MGEwYTlmNWFlNzQzMzBlOWExNTk0NzAyY2IwYWYwMzZjMTliYjMwNDI3NTJmYmM4MDQ4NDliMDNiNDY1NWU)
-   [Discord Chat](https://discord.gg/hKQfn4j)
-   [CodeMentor](https://www.codementor.io/evereq)
-   For business inquiries: <mailto:rec@ever.co>
-   Please report security vulnerabilities to <mailto:security@ever.co>

## 🔐 Security

**Ever Rec Platform** follows good security practices, but 100% security cannot be guaranteed in any software!
**Ever Rec Platform** is provided AS IS without any warranty. Use at your own risk!
See more details in the [LICENSES.md](LICENSES.md).

In a production setup, all client-side to server-side (backend, APIs) communications should be encrypted using HTTPS/WSS/SSL (REST APIs, GraphQL endpoint, Socket.io WebSockets, etc.).

If you discover any issue regarding security, please disclose the information responsibly by emailing <mailto:security@ever.co> and not by creating a GitHub issue.

## 🛡️ License

This software is available under the following licenses:

-   [Ever® Rec™ Platform Community Edition](https://github.com/ever-co/ever-rec/blob/master/LICENSES.md#ever-rec-platform-community-edition-license)
-   [Ever® Rec™ Platform Small Business](https://github.com/ever-co/ever-rec/blob/master/LICENSES.md#ever-rec-platform-small-business-license)
-   [Ever® Rec™ Platform Enterprise](https://github.com/ever-co/ever-rec/blob/master/LICENSES.md#ever-rec-platform-enterprise-license)

#### The default Ever® Rec™ Platform license, without a valid Ever® Rec™ Platform Enterprise or Ever® Rec™ Platform Small Business License agreement, is the Ever® Rec™ Platform Community Edition License

We support the open-source community. If you're building awesome non-profit/open-source projects, we're happy to help and will provide (subject to [acceptance criteria](https://github.com/ever-co/ever-rec/wiki/Free-license-and-hosting-for-Non-profit-and-Open-Source-projects)) Ever Rec Enterprise edition license and free hosting option! Feel free to contact us at <mailto:ever@ever.co> to make a request. More details are explained in our [Wiki](https://github.com/ever-co/ever-rec/wiki/Free-license-and-hosting-for-Non-profit-and-Open-Source-projects).

#### Please see [LICENSES](LICENSES.md) for more information on licenses

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fever-co%2Fever-rec-desktop.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fever-co%2Fever-rec-desktop?ref=badge_large)

## ™️ Trademarks

**Ever**® is a registered trademark of [Ever Co. LTD](https://ever.co).
**Ever® Rec™**, **Ever® Demand™**, **Ever® Gauzy™**, **Ever® Teams™** and **Ever® OpenSaaS™** are all trademarks of [Ever Co. LTD](https://ever.co).

The trademarks may only be used with the written permission of Ever Co. LTD. and may not be used to promote or otherwise market competitive products or services.

All other brand and product names are trademarks, registered trademarks, or service marks of their respective holders.

## 🍺 Contribute

-   Please give us a :star: on Github, it **helps**!
-   You are more than welcome to submit feature requests in the [separate repo](https://github.com/ever-co/feature-requests/issues)
-   Pull requests are always welcome! Please base pull requests against the _develop_ branch and follow the [contributing guide](.github/CONTRIBUTING.md).

## 💪 Thanks to our Contributors

See our contributors list in [CONTRIBUTORS.md](https://github.com/ever-co/ever-rec-desktop/blob/develop/.github/CONTRIBUTORS.md).
You can also view a full list of our [contributors tracked by Github](https://github.com/ever-co/ever-rec-desktop/graphs/contributors).

<img src="https://contributors-img.web.app/image?repo=ever-co/ever-rec-desktop" />

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=ever-co/ever-rec-desktop&type=Date)](https://star-history.com/#ever-co/ever-rec-desktop&Date)

## ❤️ Powered By

<p>
  <a href="https://www.digitalocean.com/?utm_medium=opensource&utm_source=ever-co">
    <img src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/PoweredByDO/DO_Powered_by_Badge_blue.svg" width="201px">
  </a>
</p>

<p>
 <a href="https://vercel.com/?utm_source=ever-co&utm_campaign=oss">
     <img src=".github/vercel-logo.svg" alt="Powered by Vercel" />
 </a>
</p>

## ©️ Copyright

#### Copyright © 2024-present, Ever Co. LTD. All rights reserved

---

Enjoy effortless recording with Ever® Rec™! 🎥
