abstract class RouteHandlerInterfaces {
    abstract routeRegex : RegExp;
    abstract handler: () => Promise<void>;
}