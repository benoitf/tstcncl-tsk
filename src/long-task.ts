import * as extensionApi from "@podman-desktop/api";

export class LongTask {
  private stoppedTask = false;
  private count = 0;
  private static readonly MAX_COUNT = 30;

  async execute(
    progress: extensionApi.Progress<{ message?: string; increment?: number }>,
  ): Promise<void> {
    this.count = 0;
    // while stopped task is not false, wait one second for like 30s at the maximum
    // do not wait more than MAX_COUNTs
    while (!this.stoppedTask && this.count < LongTask.MAX_COUNT) {
      const percent = Math.round((this.count * 100) / LongTask.MAX_COUNT);
      await new Promise((resolve) => setTimeout(resolve, 1_000));
      this.count++;
      progress.report({
        message: `Doing something ${this.count}/${LongTask.MAX_COUNT}`,
        increment: percent,
      });
    }
  }

  cancel(): void {
    this.stoppedTask = true;
  }
}
