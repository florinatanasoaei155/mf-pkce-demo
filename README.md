# Module Federation Sample Demo

This repository demonstrates a sample setup for Module Federation with two applications: a Remote App and a Host App.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Remote App Setup](#remote-app-setup)
- [Host App Setup](#host-app-setup)
- [Directory Structure](#directory-structure)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)
- [Contributing](#contributing)
- [License](#license)

## Overview

Module Federation is a feature in Webpack 5 that enables dynamic code sharing between independent builds. In this demo:

- **Remote App**: Exposes modules that can be consumed by the Host App.
- **Host App**: Dynamically loads modules from the Remote App at runtime.

## Prerequisites

- **Node.js**: Ensure you have Node.js (v18 or above) installed.
- **pnpm**: This project uses [pnpm](https://pnpm.io/). If you don't have it installed globally, install it with:

  ```bash
  npm install -g pnpm
  ```

## Remote App Setup

The Remote App exposes modules for the Host App. To start the Remote App, execute the following commands:

### Navigate to the remote app directory:

```bash
cd remote-app
```


### Install the dependencies

```bash
pnpm install
```
### Start the Remote App

```bash
pnpm serve
```

## Host App Setup

The Host App consumes modules provided by the Remote App. To start the Host App, run these commands:

### Navigate to the host app directory:

```bash
cd my-app
```

### Install the dependencies:

```bash
pnpm install
```

### Start the Host App (development mode):

```bash
pnpm dev
```

## Directory Structure

A typical directory structure for this project is as follows:

```lua
├── remote-app/
│   ├── package.json
│   ├── webpack.config.js
│   └── src/
│       └── ... (Remote App source files)
├── my-app/
│   ├── package.json
│   ├── webpack.config.js
│   └── src/
│       └── ... (Host App source files)
└── README.md
```


## Troubleshooting

### Dependency Issues
Ensure you run `pnpm install` in both the `remote-app` and `my-app` directories to install all necessary packages.

### Port Conflicts
If you encounter port conflicts when running `pnpm serve`, verify that the default ports are available or modify the configuration to use alternative ports.

### Module Federation Issues
Double-check that the remote module URLs in your Host App configuration match the served address of the Remote App.


## Additional Resources
- [Webpack Module Federation Documentation](https://webpack.js.org/concepts/module-federation/)
- [pnpm Documentation](https://pnpm.io/installation)


## Contributing
Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request with your improvements or bug fixes.


## License
This project is licensed under the MIT License.