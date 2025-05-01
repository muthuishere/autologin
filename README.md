# AutoLogin Extension

A Chrome extension that enables automatic login to websites by securely saving and auto-filling your credentials.

## Features

- Automatic login to your favorite websites
- Secure local storage of credentials with encryption
- Support for multiple accounts per website
- User-friendly interface for credential capture
- Open source for transparency and security

## Host Permissions Justification

This extension requires broad host permissions (`http://*/*` and `https://*/*`) for the following reasons:

1. **User Choice**: Users can capture login credentials from any website they trust. The extension does not predefine which sites can be automated.

2. **Dynamic Automation**: Auto-login functionality needs to work on any site where users have saved credentials.

3. **User Control**: All credential capture and form automation is triggered by explicit user action - never automatically.

4. **Security Measures**:
   - Credentials are stored locally with encryption
   - No automatic form submission without user consent
   - Master password protection available
   - All code is open source for transparency

5. **Privacy**: The extension does not send any data to external servers. All data is stored locally in your browser.

## Browser Compatibility

The extension is available in two versions:

### Manifest V2 (For Brave Browser)
- Supports basic authentication
- Works on Brave browser
- Not compatible with latest Chrome versions
- Download: [autologin-mv2.zip](https://github.com/muthuishere/autologin/releases/download/5.0.0/autologin-mv2.zip)

### Manifest V3 (For Chrome)
- Compatible with latest Chrome versions
- Does not support basic authentication due to Chrome's Manifest V3 policies
- Recommended for Chrome users
- Download: [autologin-mv3.zip](https://github.com/muthuishere/autologin/releases/download/5.0.0/autologin-mv3.zip)

## Installation

To install dependencies:

```bash
bun install
```

To build the extension:

```bash
bun run bundle.js
```

## Development

This project was created using `bun init` in bun v1.1.38. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Security

- All credentials are encrypted before storage
- The extension only activates on explicit user action
- Login forms are analyzed locally without sending data to external servers
- Source code is available for security review at https://github.com/muthuishere/autologin

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Muthukumaran Navaneethakrishnan

## Author

Muthukumaran Navaneethakrishnan
GitHub: https://github.com/muthuishere
