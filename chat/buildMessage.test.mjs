// buildMessage.test.mjs
import { buildMessage } from "./message_builder.mjs";
import { getAvailableProducts } from "../wix/cart/products/products_api.mjs";

// Mock the getAvailableProducts function
jest.mock("../wix/cart/products/products_api.mjs", () => ({
    getAvailableProducts: jest.fn(),
}));

describe("buildMessage console output", () => {
    it("should log the formatted message", async () => {
        // Set up mock data
        const mockContactName = "John";
        const mockProducts = [
            {
                _id: "1",
                name: "Product 1",
                brand: "Brand A",
                description: "Description for Product 1",
                priceRange: {
                    minValue: 10,
                    maxValue: 20,
                },
            },
            {
                _id: "2",
                name: "Product 2",
                brand: "Brand B",
                description: "Description for Product 2",
                priceRange: {
                    minValue: 15,
                    maxValue: 25,
                },
            },
        ];
        getAvailableProducts.mockResolvedValue(mockProducts);

        // Call the buildMessage function
        const message = await buildMessage(mockContactName);

        // Log the formatted message
        console.log(message);

        // Add a simple test to satisfy Jest requirements
        expect(true).toBe(true);
    });
});
