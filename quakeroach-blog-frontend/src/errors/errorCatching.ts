import AppError from "./AppError";

function isAppError(e: any): boolean {
  return typeof e === 'object' && Object.hasOwn(e, 'isAppError');
}

function asAppError(e: any): asserts e is AppError {
  if (!isAppError(e)) {
    throw new TypeError("obj was not an AppError");
  }
}

export function handleError(error: any, action: (error: AppError) => void): void;
export function handleError<TError extends AppError>(error: any, expectedErrorType: new(...a: any) => TError, action: (error: TError) => void): void;
export function handleError<TError extends AppError>(
  error: any,
  expectedErrorTypeOrAction: (new(...a: any) => TError) | ((error: AppError) => void),
  typedAction?: (error: TError) => void,
): void {
  if (isAppError(error)) {
    asAppError(error);

    if (typedAction !== undefined) {
      const expectedErrorType = (expectedErrorTypeOrAction as new(...a: any) => TError);
      if (error instanceof expectedErrorType) {
        typedAction(error);
        return;
      }
    }
    
    const action = (expectedErrorTypeOrAction as (error: AppError) => void);
    action(error);
    return;
  }

  throw error;
}