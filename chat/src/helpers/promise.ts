type Result<Inner> =
  | {
      result: Inner;
      error: null;
      isSuccessful: true;
    }
  | {
      result: null;
      error: any;
      isSuccessful: false;
    };

export const toResult = async <Inner>(
  promise: Promise<Inner>
): Promise<Result<Inner>> => {
  try {
    return {
      result: await promise,
      error: null,
      isSuccessful: true,
    };
  } catch (exception) {
    return {
      result: null,
      error: exception,
      isSuccessful: false,
    };
  }
};
