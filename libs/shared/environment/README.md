# @ever-co/shared-environment

A robust, SOLID-principles-based environment management library for Angular applications.

## Features

- 🏗️ **SOLID Principles** - Follows all five SOLID principles
- 🎨 **Design Patterns** - Implements Singleton, Factory, Builder, Strategy, Adapter, Facade, Command, and Observer patterns
- 🔒 **Type Safety** - Full TypeScript support with comprehensive interfaces
- ✅ **Validation** - Extensible validation system with custom rules
- 🔄 **Async/Sync** - Support for both asynchronous and synchronous operations
- 🧪 **Testable** - Comprehensive unit tests included
- 📦 **Reusable** - Can be used across multiple Angular applications

## Installation

```bash
npm install @ever-co/shared-environment
```

## Quick Start

```typescript
import { Environment, EnvironmentService, createEnvironmentProviders } from '@ever-co/shared-environment';

// Configure environment loading
Environment.setLoadFunction(() => {
  // Your environment loading logic
  return { API_URL: 'http://localhost:3000' };
});

// Use in components
@Component({
  providers: [...createEnvironmentProviders()]
})
export class MyComponent {
  constructor(private envService: EnvironmentService) {}
  
  async ngOnInit() {
    const apiUrl = await this.envService.get('API_URL');
    console.log('API URL:', apiUrl);
  }
}
```

## Architecture

The library implements multiple design patterns:

- **Singleton Pattern** - Environment class ensures single instance
- **Factory Pattern** - ConfigurationFactory creates configuration objects
- **Builder Pattern** - ConfigurationBuilder constructs complex configurations
- **Strategy Pattern** - Different loading strategies for various environments
- **Adapter Pattern** - Adapts new system to legacy interfaces
- **Facade Pattern** - EnvironmentService provides simplified interface

## API Reference

### Environment Class

```typescript
// Get singleton instance
const env = Environment.getInstance();

// Access configuration
console.log(env.apiUrl);
console.log(env.appName);
console.log(env.debug);
```

### EnvironmentService

```typescript
// Async operations
const apiUrl = await envService.get('API_URL', 'default');
const isDebug = await envService.getBoolean('DEBUG', false);
const port = await envService.getNumber('PORT', 3000);

// Validation
const validation = await envService.getValidationResult();
```

### Configuration Models

```typescript
import { ConfigurationFactory } from '@ever-co/shared-environment';

const config = ConfigurationFactory.createConfiguration(envVars);
console.log(config.apiUrl);
console.log(config.google.clientId);
```

## Testing

```bash
# Run tests
nx test environment

# Build library
nx build environment
```

## Contributing

1. Follow SOLID principles
2. Add comprehensive tests
3. Update documentation
4. Ensure backward compatibility

## License

AGPL-3.0
