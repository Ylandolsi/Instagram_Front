import { URL } from "@/api/axios";
import { Notification } from "@/types/notification.type";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

// Define types for our service
type CallbackFunction = (data: any) => void;
type EventName = "notification" | string;

class SignalRService {
  private connection: HubConnection | null = null;
  private callbacks: Map<EventName, CallbackFunction[]> = new Map();
  private connectionPromise: Promise<void> | null = null;

  /**
   * Start the SignalR connection for a specific user
   * @param userId The user ID to connect with
   * @returns Promise that resolves when connected
   */
  async startConnection(userId: string): Promise<void> {
    // Don't start a new connection if one is already in progress
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise<void>(async (resolve, reject) => {
      try {
        // Create the connection
        this.connection = new HubConnectionBuilder()
          .withUrl(`${URL}/hubs/notifications`, {
            withCredentials: true, // enables sending cookies with the request
          })
          .configureLogging(LogLevel.Information)
          .withAutomaticReconnect()
          .build();

        // Set up event handlers
        this.connection.on(
          "ReceiveNotification",
          (notification: Notification) => {
            this.invokeCallbacks("notification", notification);
          }
        );

        // Handle reconnection event
        this.connection.onreconnected((connectionId?: string) => {
          console.log("SignalR Reconnected:", connectionId);
          // Rejoin user group after reconnection
          if (this.connection) {
            this.connection
              .invoke("JoinUserGroup", userId)
              .catch(console.error);
          }
        });

        await this.connection.start();
        console.log("SignalR Connected successfully");

        // Join user notification group
        await this.connection.invoke("JoinUserGroup", userId);
        resolve();
      } catch (error) {
        console.error("SignalR Connection Error:", error);
        this.connection = null;
        reject(error);
      } finally {
        this.connectionPromise = null;
      }
    });

    return this.connectionPromise;
  }

  /**
   * Add a callback function to be triggered when a specific event occurs
   * @param event The event name to listen for
   * @param callback The function to call when the event is triggered
   */
  addCallback(event: EventName, callback: CallbackFunction): void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }

    const eventCallbacks = this.callbacks.get(event);
    if (eventCallbacks) {
      eventCallbacks.push(callback);
    }
  }

  /**
   * Remove a specific callback function from an event
   * @param event The event name
   * @param callback The callback function to remove
   */
  removeCallback(event: EventName, callback: CallbackFunction): void {
    if (!this.callbacks.has(event)) return;

    const eventCallbacks = this.callbacks.get(event);
    if (eventCallbacks) {
      const index = eventCallbacks.indexOf(callback);
      if (index !== -1) {
        eventCallbacks.splice(index, 1);
      }
    }
  }

  /**
   * Invoke all callbacks registered for a specific event
   * @param event The event name
   * @param data The data to pass to each callback
   */
  private invokeCallbacks(event: EventName, data: any): void {
    const callbacks = this.callbacks.get(event) || [];
    callbacks.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in SignalR ${event} callback:`, error);
      }
    });
  }

  /**
   * Check if the connection is active
   * @returns true if connected, false otherwise
   */
  isConnected(): boolean {
    return !!this.connection && this.connection.state === "Connected";
  }

  /**
   * Stop the SignalR connection
   * @param userId The user ID to disconnect
   * @returns Promise that resolves when disconnected
   */
  async stopConnection(userId: string): Promise<void> {
    if (this.connection) {
      try {
        // Leave the user group first
        if (this.isConnected()) {
          await this.connection.invoke("LeaveUserGroup", userId);
        }

        // Stop the connection
        await this.connection.stop();
        console.log("SignalR Disconnected");

        // Clear resources
        this.connection = null;
      } catch (error) {
        console.error("Error disconnecting SignalR:", error);
        throw error; // Rethrow to allow caller to handle
      }
    }
  }

  clearCallbacks(): void {
    this.callbacks.clear();
  }
}

export default new SignalRService();
