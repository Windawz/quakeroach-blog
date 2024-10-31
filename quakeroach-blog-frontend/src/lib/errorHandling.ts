export async function forwardErrors<T>(
  setter: (error: unknown) => void,
  action: () => Promise<T>,
) {
  try {
    await action();
  } catch (e) {
    setter(e);
  }
}