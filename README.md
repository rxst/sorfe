# Sorfe
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/rxst/sorfe/tree/master/LICENSE) [![npm version](https://img.shields.io/npm/v/sorfe.svg?style=flat)](https://www.npmjs.com/package/sorfe)
***
Sorfe is a TypeScript library for creating services easily.

## Installation

For install using [npm](https://www.npmjs.com/package/sorfe) use command:

```shell
npm install sorfe
```

## Examples

### **Simple service implementation**  

> Service with methods is a basic endpoint implementation. It gives possibility to call methods from application client.

#### **`service.ts`**
```typescript
import { Service, Method } from 'sorfe';

// Service decorator added to your service methadata with name of service
// !Name of service is unic options for all services
@Service({ name: 'example' })
class ExampleService {
    // Method decorator added to your service methadata with name of method and make in callable from client
    // No restrictions on parameters or return value
    @Method({ name: 'example' })
    public callableMethod(): any {
       // Implementation
    }    
}

```


#### **`index.ts`**
```typescript
import { Sorfe, TransportIpc } from 'sorfe';
import { ExampleService } from 'service.ts';

const sorfe = new Sorfe({
    // Transport protocol for you project
    transport: TransportIpc, 
    // All service who can be used but without name duplication
    services: [
        ExampleService
    ]
})
```

### **Transport service implementation**

> Transport service is one of key part for sorfe lib.
> The transport layer describes how data will be transmitted between application parts.
> In example realized transport service for Electron IPC.

> **Require:**
> * Transport service must extends TransportAbstract.
#### **`custom_transport.ts`**
```typescript
import { TransportAbstract, IRequest, IResponseReject, IResponseSuccess } from "sorfe";
import { ipcMain, IpcMainEvent } from 'electron';

export class TransportIpc extends TransportAbstract {
    private static _ipcChannel: string = process.env.IPC_CHANNEL || 'sorfe';

    /**
     * Method realized ipc communications by "sorfe" channel. Channel can be changed by IPC_CHANNEL env parameter
     */
    transportMessageHandler(listener: (message: IRequest, send: (response: (IResponseSuccess | IResponseReject)) => void) => void): void {
        ipcMain.on(TransportIpc._ipcChannel, (event: IpcMainEvent, request: IRequest) => {
            listener(request, async (response: IResponseSuccess | IResponseReject) => {
                event.reply(response);
            })
        });
    }

}

```
