# Contributing to Beauty Shop

Thank you for your interest in contributing to Beauty Shop! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x
- npm 10.x
- Git

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/beauty-shop.git`
3. Install dependencies: `npm install`
4. Setup environment: `npm run env:setup`
5. Start development: `npm run dev`

## 📋 Development Workflow

### Branch Naming
- Feature: `feature/CORE-{id}-{short-title}`
- Bug fix: `fix/CORE-{id}-{short-title}`
- Chore: `chore/CORE-{id}-{short-title}`
- Hotfix: `hotfix/CORE-{id}-{short-title}`

### Commit Convention
We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(auth): add login functionality
fix(cart): resolve checkout bug
docs(readme): update setup instructions
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Pull Request Process
1. Create feature branch from `main`
2. Make your changes
3. Run tests: `npm run check`
4. Create pull request with template
5. Wait for review and approval
6. Merge after approval

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test -- src/components/Button.test.tsx
```

### Writing Tests
- Unit tests for all components and utilities
- Integration tests for API endpoints
- E2E tests for critical user flows
- Test coverage should be >80%

## 📝 Code Style

### TypeScript
- Use strict mode
- Define interfaces for all data structures
- Avoid `any` type
- Use proper error handling

### React/Next.js
- Use functional components with hooks
- Follow Next.js best practices
- Use TypeScript for all components
- Implement proper error boundaries

### Styling
- Use Tailwind CSS classes
- Follow design system guidelines
- Ensure responsive design
- Test accessibility

## 🔍 Code Review

### Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No console.log statements
- [ ] No TODO comments
- [ ] Performance considerations
- [ ] Security implications

### Review Process
1. Automated checks must pass
2. At least one approval required
3. Address all review comments
4. Squash commits before merging

## 🐛 Bug Reports

Use the bug report template and include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable

## 🚀 Feature Requests

Use the feature request template and include:
- Clear description of the feature
- Motivation and use case
- Acceptance criteria
- Design considerations
- Technical considerations

## 📚 Documentation

### Project Documentation
- [Project Brief](.project/01-Project_Brief.md)
- [Tech Stack](.project/03-Tech_Stack.md)
- [API Design](.project/05-API_Design.md)

### Code Documentation
- Document complex functions
- Add JSDoc comments for public APIs
- Update README for new features
- Keep CHANGELOG updated

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow the golden rule

### Getting Help
- Check existing issues and discussions
- Ask questions in GitHub Discussions
- Join our community channels
- Read the documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the ISC License.

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Beauty Shop! 🎉
