# Sorfe 
> Electron ipc lib for server api



## Installation

> :warning: Package not stable now.

To install last version, use [`npm`](https://docs.npmjs.com/).
The preferred method is to install as dependency in you application:
```shell script
npm install sorfe
```


## Programmatic usage

Most people use Sorfe with TypeScript in electron app.

#### Start sorfe 
> Sorfe started by execute start method from EndPointAPI.

```typescript
import { EndPointAPI } from 'sorfe';
import { TestService } from './services/test';

EndPointAPI.start([TestService], 'test');

```

#### Service example
> For service used decorators ``` @EndPoint ``` and ```@EndPointMethod```

```typescript
import { EndPoint, EndPointMethod } from 'sorfe';

@EndPoint({name: 'test_service'})
class TestService {
    @EndPointMethod({name: 'test_method'})
    test(): void {
        // code implementation
    }
}
```

