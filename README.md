# Usability Testing App

Welcome to the Usability Testing App, a modern web-based platform designed to streamline the process of conducting and managing usability tests. This application enables teams to create testing sessions, define tasks using Markdown, and gather valuable feedback from testers—all in one intuitive interface.

## Key Features

- **Session Management:**  
  Easily create, organize, and manage testing sessions. Define detailed tasks either by uploading Markdown files or writing them manually.

- **Task Definition & Parsing:**  
  Write clear task descriptions with scenarios, steps, and success criteria. The app automatically parses and organizes these tasks for seamless testing.

- **User Test Management:**  
  Record individual tester feedback including task outcomes (pass/fail), comments, and overall observations. Edit and update results in real time.

- **Interactive Interface:**  
  Navigate through tasks using both list and carousel views for a flexible and engaging user experience, built with Next.js and Material-UI.

- **Real-Time Updates & Analysis:**  
  Quickly view and analyze session data to identify usability issues and improve your product’s user experience.

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   cd usability-testing
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

### Running the App

Start the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser to start testing.

## Project Structure

```
/src/app - Main application pages and API routes.
/src/components - Reusable React components (e.g., Task Carousel, User Test Cards, and more).
/src/context - Context providers for managing sessions and loading states.
/src/utils - Utility functions including Markdown task parsing.
/public - Static assets such as SVG icons and images.
```

## Technologies Used

- **Next.js** - A robust framework for server-rendered React applications.
- **Material-UI** - A comprehensive UI component library for a modern look and feel.
- **React & TypeScript** - For building a scalable and type-safe application.
- **UUID** - To generate unique identifiers for sessions and tests.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request if you have suggestions or improvements.

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact **[Your Name]** at **[your.email@example.com]**.

Happy Testing!
