import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OrderHistory from "../components/OrderHistory";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

// Mock Firestore
jest.mock("../firebaseConfig", () => ({
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

const mockOrders = [
  {
    id: "order1",
    createdAt: { toDate: () => new Date("2023-01-01T12:00:00Z"), seconds: 1672574400 },
    items: [
      { id: "1", name: "Product A", price: 10, quantity: 2 },
      { id: "2", name: "Product B", price: 20, quantity: 1 },
    ],
    totalPrice: 40,
  },
];

describe("OrderHistory", () => {
  beforeEach(() => {
    (getDocs as jest.Mock).mockResolvedValue({
      forEach: (cb: any) => mockOrders.forEach((order) => cb({ id: order.id, data: () => order })),
    });
  });

  it("renders loading state", async () => {
    render(<OrderHistory userId="user123" />);
    expect(screen.getByText(/loading order history/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/loading order history/i)).not.toBeInTheDocument());
  });

  it("renders order list", async () => {
    render(<OrderHistory userId="user123" />);
    await screen.findByText(/Order History/i);
    expect(screen.getByText(/Product A, Product B/)).toBeInTheDocument();
    expect(screen.getByText(/\$40.00/)).toBeInTheDocument();
  });

  it("shows order details when an order is clicked", async () => {
    render(<OrderHistory userId="user123" />);
    await screen.findByText(/Product A, Product B/);
    fireEvent.click(screen.getByText(/Product A, Product B/));
    expect(screen.getByText(/Order Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Product A - \$10 x 2/)).toBeInTheDocument();
    expect(screen.getByText(/Product B - \$20 x 1/)).toBeInTheDocument();
  });

  it("shows 'No orders found.' if there are no orders", async () => {
    (getDocs as jest.Mock).mockResolvedValueOnce({
      forEach: (cb: any) => {},
    });
    render(<OrderHistory userId="user123" />);
    expect(await screen.findByText(/No orders found/i)).toBeInTheDocument();
  });
});