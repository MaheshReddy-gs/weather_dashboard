const { render } = require("@testing-library/react");
const WeatherCard = require("../WeatherCard");
const { QueryClient, QueryClientProvider } = require("react-query");

const queryClient = new QueryClient();

test("WeatherCard snapshot", () => {
    const { container } = render(
        <QueryClientProvider client={queryClient}>
            <WeatherCard city="Bengaluru" />
        </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
});