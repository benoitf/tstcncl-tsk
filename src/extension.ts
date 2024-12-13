import type { ExtensionContext } from "@podman-desktop/api";
import * as extensionApi from "@podman-desktop/api";
import { LongTask } from "./long-task";

// Initialize the activation of the extension.
export async function activate(
  extensionContext: ExtensionContext,
): Promise<void> {
  // register a command

  extensionContext.subscriptions.push(
    extensionApi.commands.registerCommand("dummy.longTask", async () => {
      extensionApi.window.withProgress(
        {
          location: extensionApi.ProgressLocation.TASK_WIDGET,
          title: `Dummy long task`,
          cancellable: true,
        },
        async (progress, token) => {
          const longTask = new LongTask();

          token.onCancellationRequested(() => {
            extensionApi.window.showInformationMessage(
              "received an order to cancel the task",
            );
            longTask.cancel();
          });

          await longTask.execute(progress);

          console.log(
            "is that task is canceled ?",
            token.isCancellationRequested,
          );
        },
      );
    }),
    extensionApi.commands.registerCommand("dummy.multipleTasks", async () => {
      extensionApi.window.withProgress(
        {
          location: extensionApi.ProgressLocation.TASK_WIDGET,
          title: `Dummy long task`,
          cancellable: true,
        },
        async (progress, token) => {
          const longTask = new LongTask();

          token.onCancellationRequested(() => {
            extensionApi.window.showInformationMessage(
              "received an order to cancel the task",
            );
            longTask.cancel();
          });

          await longTask.execute(progress);
        },
      );

      extensionApi.window.withProgress(
        {
          location: extensionApi.ProgressLocation.TASK_WIDGET,
          title: `Dummy failing task`,
        },
        async (progress, token) => {
          throw new Error("This is a failing error");
        },
      );

      extensionApi.window.withProgress(
        {
          location: extensionApi.ProgressLocation.TASK_WIDGET,
          title: `Task with action`,
          details: {
            routeId: "dummy-route-id",
            routeArgs: ["hello", "world"],
          },
        },
        async () => {},
      );

      extensionApi.window.withProgress(
        {
          location: extensionApi.ProgressLocation.TASK_WIDGET,
          title: `Dummy short task non cancellable`,
          cancellable: false,
        },
        async (progress, token) => {},
      );
    }),

    extensionApi.commands.registerCommand(
      "handle-dummy-route",
      async (...args: string[]) => {
        const result = await extensionApi.window.showInformationMessage(
          `Calling the action of the task, received ${args}, will then display containers page`,
        );
        await extensionApi.navigation.navigateToContainers();
      },
    ),

    // register the route

    extensionApi.navigation.register("dummy-route-id", "handle-dummy-route"),
  );

  return;
}

// Deactivate the extension
export async function deactivate(): Promise<void> {
  console.log("stopping hello world extension");
}
