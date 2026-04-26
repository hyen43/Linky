import "@testing-library/jest-native/extend-expect";

// Provide no-op TanStack Query stubs so components using useMutation/useQueryClient
// render without needing a real QueryClientProvider in every test.
jest.mock("@tanstack/react-query", () => {
  const actual = jest.requireActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: () => ({ invalidateQueries: jest.fn() }),
    useMutation: () => ({
      mutate: jest.fn(),
      mutateAsync: jest.fn(),
      isPending: false,
      isError: false,
      isSuccess: false,
      error: null,
      data: undefined,
      reset: jest.fn(),
    }),
  };
});
