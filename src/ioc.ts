import { Container, decorate, injectable } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { Controller } from "tsoa";
import ContainerConfigLoader from "./config/container";

// Create a new container tsoa can use
const iocContainer = new Container();

decorate(injectable(), Controller); // Makes tsoa's Controller injectable

// make inversify aware of inversify-binding-decorators
iocContainer.load(buildProviderModule());

(async () => {
    // initialize all container binding objects
    await new ContainerConfigLoader().Load(iocContainer);
})();

// export according to convention
export { iocContainer };