abstract class RouteHandlerInterface {
    abstract isDetected(): boolean;
    abstract handler(): Promise<void>;
}