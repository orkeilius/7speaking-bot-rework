abstract class RouteHandlerInterface {
    abstract routeRegex : RegExp;
    abstract handler: () => Promise<void>;
}