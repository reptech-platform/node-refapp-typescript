import { fluentProvide } from "inversify-binding-decorators";
import { interfaces, inject } from "inversify";

const provideSingleton = function <T>(
    identifier: interfaces.ServiceIdentifier<T>
) {
    return fluentProvide(identifier).inSingletonScope().done();
};


export { provideSingleton, inject };